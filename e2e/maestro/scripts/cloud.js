// The one script the flows use to change data in the Cloud under test. Maestro runs each
// script in its own context, so the flow picks the action by name:
//   - runScript: { file: ../scripts/cloud.js, env: { ACTION: attest-purchasing-available } }
// -e variables CLOUD, ADMIN, AUTHOR, PUBLISHER arrive as globals.
function call(method, path, token, body) {
  var res = http.request(CLOUD + path, {
    method: method,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { status: res.status, json: res.body ? json(res.body) : null }
}

function digest(releaseId) {
  var release = call('GET', '/api/cloud/marketplace/releases/' + releaseId, ADMIN)
  if (release.status !== 200) throw new Error('read ' + releaseId + ': ' + release.status)
  return release.json.data.manifest_sha256
}

function attest(releaseId, level, token, sha, evidence) {
  return call('POST', '/api/cloud/marketplace/releases/' + releaseId + '/availability', token,
    { level: level, evidence_ref: evidence, manifest_sha256: sha })
}

function item(slug) {
  var all = call('GET', '/api/cloud/roadmap-items', ADMIN).json.items
  for (var i = 0; i < all.length; i++) if (all[i].slug === slug) return all[i]
  throw new Error('no roadmap item ' + slug)
}

function save(it) {
  var res = call('PUT', '/api/cloud/roadmap-items', ADMIN, it)
  if (res.status !== 200) throw new Error('save ' + it.slug + ': ' + res.status)
}

function expect(what, got, want) {
  if (got !== want) throw new Error(what + ': got ' + got + ', want ' + want)
}

function plan(code) {
  var all = call('GET', '/api/cloud/plans', ADMIN).json.items
  for (var i = 0; i < all.length; i++) if (all[i].code === code) return all[i]
  throw new Error('no plan ' + code)
}

function setPricing(mode, notice) {
  var res = call('PUT', '/api/cloud/pricing-mode', ADMIN, { mode: mode, notice: notice })
  if (res.status !== 200) throw new Error('pricing-mode ' + mode + ': ' + res.status + ' ' + JSON.stringify(res.json))
}

// The contact flow passes the text it typed as MARKER; the lead must be in Cloud exactly once.
function expectOneLead(marker, source, email) {
  var all = call('GET', '/api/cloud/leads', ADMIN).json.items
  var found = []
  for (var i = 0; i < all.length; i++) if (all[i].notes.indexOf(marker) >= 0) found.push(all[i])
  expect('leads with ' + marker, found.length, 1)
  expect('lead source', found[0].source, source)
  expect('lead email', found[0].contact_email, email)
  expect('lead status', found[0].status, 'new')
}

// The release the catalog currently shows for Buying, whatever version the seed is at.
function currentRelease(slug) {
  var items = json(http.get(CLOUD + '/api/public/catalog/v1/modules').body).data.items
  for (var i = 0; i < items.length; i++) if (items[i].slug === slug) return items[i].release_id
  throw new Error('the catalog lists no module ' + slug)
}
var BUY = currentRelease('erp-buy')
var actions = {
  'attest-purchasing-available': function () { expect('attest available', attest(BUY, 'available', PUBLISHER, digest(BUY), 'maestro-flow').status, 200) },
  'attest-purchasing-preview': function () { expect('attest preview', attest(BUY, 'preview', PUBLISHER, digest(BUY), '').status, 200) },
  // Cloud must refuse a claim it cannot back, and the author must not be able to make one.
  'reject-bad-attestations': function () {
    expect('wrong digest', attest(BUY, 'available', PUBLISHER, '0'.repeat(64), 'maestro-flow').status, 409)
    expect('no evidence', attest(BUY, 'available', PUBLISHER, digest(BUY), '').status, 409)
    expect('author token', attest(BUY, 'available', AUTHOR, digest(BUY), 'maestro-flow').status, 401)
  },
  'edit-purchasing-limitation': function () { var it = item('purchasing'); it.limitations = ['Supplier returns are not built yet.']; save(it) },
  'restore-purchasing-limitation': function () { var it = item('purchasing'); it.limitations = ['Purchase orders and supplier bills.']; save(it) },
  'move-accounting-to-building': function () { var it = item('accounting'); it.horizon = 'building'; save(it) },
  'restore-accounting': function () { var it = item('accounting'); it.horizon = 'next'; save(it) },
  // A plan row with a price exists in every Cloud (the defaults), yet the site stays on the
  // pilot terms until the operator switches the mode.
  'pricing-priced': function () {
    var growth = plan('growth')
    if (!growth.active) throw new Error('the growth plan is not active')
    setPricing('priced', 'Prices apply from the first of March.')
  },
  'pricing-pilot': function () { setPricing('pilot', '') },
  'expect-one-lead': function () { expectOneLead(MARKER, 'website:contact', 'amina.e2e@example.com') },
  'expect-waitlist-lead': function () { expectOneLead(MARKER, 'website:waitlist:schools-and-training', 'waitlist.e2e@example.com') },
}
if (!actions[ACTION]) throw new Error('unknown ACTION ' + ACTION)
actions[ACTION]()

// Reads the verification link Cloud emailed to EMAIL from the mail catcher at MAILPIT and
// hands it to the flow as output.link:
//   - runScript: { file: ../scripts/mail.js, env: { EMAIL: ..., MAILPIT: ${MAILPIT} } }
var found = json(http.get(MAILPIT + '/api/v1/search?query=to:' + encodeURIComponent(EMAIL)).body).messages
if (!found || found.length === 0) throw new Error('no email was sent to ' + EMAIL)
var message = json(http.get(MAILPIT + '/api/v1/message/' + found[0].ID).body)
var match = message.Text.match(/https?:\/\/\S+#token=[A-Za-z0-9]+/)
if (!match) throw new Error('the email to ' + EMAIL + ' has no verification link')
output.link = match[0]

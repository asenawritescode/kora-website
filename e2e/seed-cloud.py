#!/usr/bin/env python3
"""Seed a disposable Kora Cloud with the data the website shows.

Publishes three module releases and one template that composes them, through the real review flow (author, reviewer,
publisher), attests two as available and leaves one as preview, then loads the
roadmap items that mirror the website's module list. Re-running skips releases
that already exist (releases are immutable) and upserts roadmap items.

  CLOUD=http://127.0.0.1:18081 ADMIN=... AUTHOR=... REVIEWER=... PUBLISHER=... python3 seed-cloud.py
"""
import json, os, sys, urllib.error, urllib.request

CLOUD = os.environ.get("CLOUD", "http://127.0.0.1:18081").rstrip("/")
TOKENS = {k: os.environ[k.upper()] for k in ("admin", "author", "reviewer", "publisher")}

def call(method, path, role, body=None, ok=(200, 201, 204)):
    req = urllib.request.Request(CLOUD + path, method=method, data=None if body is None else json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + TOKENS[role], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            data = res.read()
            return res.status, (json.loads(data) if data else None)
    except urllib.error.HTTPError as err:
        text = err.read().decode()
        try:
            payload = json.loads(text)
        except ValueError:
            payload = {"error": text}
        return err.code, payload

def must(result, what, ok=(200, 201, 204)):
    status, payload = result
    if status not in ok:
        sys.exit(f"{what} failed: {status} {payload}")
    return payload

# Releases as the real Cloud names them. None of these is a name the website uses:
# the site joins to them by release slug, so a seed that echoed the site's names
# would hide a broken join. (release slug, name, summary, doctype, availability, category)
RELEASES = [
    ("erp-sell", "Selling and cash", "Sell at the counter in any currency, take payments, work a till, track expenses.", "POS Sale", "available", "Sell"),
    ("erp-stock", "Stock", "Change stock with a reason, and see it change from any screen.", "Stock Item", "available", "Stock"),
    ("erp-buy", "Buying", "Order from suppliers, record deliveries, bills and payments.", "Purchase Order", "preview", "Money"),
    ("erp-books", "Books", "Accounts, periods and balanced journal entries.", "Journal Entry", "available", "Money"),
    # The parts of a second retail template, as the real Cloud has: the picker must
    # not mix them with the first template's.
    ("shop-sell", "Selling at the counter", "Ring up sales, take payment and close the day.", "Shop Sale", "available", "Sell"),
    ("shop-stock", "Products and stock", "Your product list, prices and stock counts.", "Shop Item", "available", "Stock"),
]

# What a release needs, by release slug: Books posts against stock, so ticking it
# makes Cloud explain that Stock comes with it.
REQUIRES = {"erp-books": ["erp-stock"]}

# 1.0.0 published record types with no fields at all, which the Engine accepts but nobody
# can use (and which used to crash Studio's pages). Later versions have real ones; 1.2.0 asks
# only for what a till needs to take a sale (a reference and a total). Releases
# are immutable, so a stack seeded with 1.0.0 keeps those and gets 1.1.0 beside them; the
# newest published release of a slug is the one the catalog shows.
VERSION = "1.2.0"
def rid(slug, version=None): return f"{slug}-{version or VERSION}"

# Templates are what the /start picker lists. Each composes module releases.
TEMPLATES = [
    ("retail-erp", "Retail with back office", "Sell, track stock and buy from suppliers.", "Retail Back Office",
     [(rid("erp-sell"), "required"), (rid("erp-stock"), "default"), (rid("erp-books"), "optional"), (rid("erp-buy"), "optional")]),
    ("shop", "Shop", "Sell, count stock and see what you earned.", "Shop Day",
     [(rid("shop-sell"), "required"), (rid("shop-stock"), "default")]),
]

# The fields of each record type, in the format of the packs under kora/config:
# (fieldname, fieldtype, label, flags). A "options" flag is a list for a Select.
REF = ("reference", "Data", "Reference", {"reqd": True, "unique": True, "in_list_view": True})
NOTE = ("note", "Text", "Note", {})
FIELDS = {
    "POS Sale": ("reference, customer", [REF,
        ("customer", "Data", "Customer", {"in_list_view": True}),
        ("sale_date", "Date", "Sale date", {"in_list_view": True}),
        ("payment_method", "Select", "Payment method", {"options": ["Cash", "M-Pesa", "Card"], "in_list_view": True, "in_standard_filter": True}),
        ("total", "Currency", "Total", {"reqd": True, "in_list_view": True}), NOTE]),
    "Stock Item": ("sku, item_name", [
        ("sku", "Data", "SKU", {"reqd": True, "unique": True, "in_list_view": True}),
        ("item_name", "Data", "Item", {"reqd": True, "in_list_view": True}),
        ("unit", "Select", "Unit", {"options": ["Piece", "Kg", "Litre", "Box"], "reqd": True, "in_standard_filter": True}),
        ("stock_qty", "Float", "In stock", {"in_list_view": True}),
        ("reorder_level", "Float", "Reorder at", {}),
        ("selling_price", "Currency", "Selling price", {"in_list_view": True})]),
    "Purchase Order": ("reference, supplier", [REF,
        ("supplier", "Data", "Supplier", {"reqd": True, "in_list_view": True}),
        ("order_date", "Date", "Order date", {"reqd": True, "in_list_view": True}),
        ("status", "Select", "Status", {"options": ["Draft", "Ordered", "Received"], "reqd": True, "in_list_view": True, "in_standard_filter": True}),
        ("total", "Currency", "Total", {"in_list_view": True})]),
    "Journal Entry": ("reference, description", [REF,
        ("posting_date", "Date", "Posting date", {"reqd": True, "in_list_view": True}),
        ("description", "Data", "Description", {"in_list_view": True}),
        ("debit_account", "Data", "Debit account", {"reqd": True}),
        ("credit_account", "Data", "Credit account", {"reqd": True}),
        ("amount", "Currency", "Amount", {"reqd": True, "in_list_view": True})]),
    "Shop Sale": ("reference", [REF,
        ("sale_date", "Date", "Sale date", {"reqd": True, "in_list_view": True}),
        ("total", "Currency", "Total", {"reqd": True, "in_list_view": True})]),
    "Shop Item": ("item_name", [
        ("item_name", "Data", "Item", {"reqd": True, "unique": True, "in_list_view": True}),
        ("stock_qty", "Float", "In stock", {"in_list_view": True}),
        ("selling_price", "Currency", "Selling price", {"in_list_view": True})]),
    "Retail Back Office": ("reference", [REF, NOTE]),
    "Shop Day": ("reference", [REF, NOTE]),
}

def doctype_yaml(doctype, module, spec=None):
    search, fields = spec or FIELDS[doctype]
    out = [f"name: {doctype}", f"module: {module}", f"title_field: {fields[0][0]}", f"search_fields: {search}", "sort_field: creation", "sort_order: DESC", "", "fields:"]
    for fieldname, fieldtype, label, flags in fields:
        out += [f"  - fieldname: {fieldname}", f"    fieldtype: {fieldtype}", f"    label: {label}"]
        for key, value in flags.items():
            if key == "options":
                out += ["    options: |"] + [f"      {o}" for o in value]
            else:
                out.append(f"    {key}: {'true' if value else 'false'}")
    return "\n".join(out) + "\n"

def publish(slug, name, summary, doctype, level, category="", kind="module", composition=(), version=None, spec=None):
    version = version or VERSION
    release_id = rid(slug, version)
    manifest = {"schema_version": 1, "package_id": slug, "release_id": release_id, "version": version, "kind": kind,
                "public": {"slug": slug, "name": name, "summary": summary, **({"category": category} if category else {})},
                "exports": {"doctypes": [doctype], "capabilities": [slug + ".use"]},
                "engine": {"min_version": "1.0.0"}}
    if REQUIRES.get(slug):
        manifest["requires"] = [{"package_id": r, "release_id": rid(r, version)} for r in REQUIRES[slug]]
    if composition:
        manifest["composition"] = [{"release_id": rid, "selection": sel} for rid, sel in composition]
    files = [{"path": f"doctypes/{slug}.yaml", "content_type": "doctype", "content": doctype_yaml(doctype, name, spec)}]
    status, payload = call("POST", "/api/cloud/marketplace/releases", "author", {"manifest": manifest, "files": files})
    if status == 409 or "duplicate entry" in json.dumps(payload).lower():
        # Releases are immutable and attestations append-only: a release that
        # already exists was fully seeded by an earlier run.
        print(f"  {release_id}: already there")
        return
    release = must((status, payload), f"create {release_id}")["data"]
    steps = [("validate", "author", None), ("security-review", "author", None),
             ("reviews/security", "reviewer", {"decision": "approved", "reason": "Seed data for the local website test."}),
             ("compatibility-review", "reviewer", None),
             ("reviews/compatibility", "reviewer", {"decision": "approved", "reason": "Seed data for the local website test."}),
             ("publish", "publisher", None)]
    for step, role, body in steps:
        must(call("POST", f"/api/cloud/marketplace/releases/{release_id}/{step}", role, body or {}), f"{release_id} {step}")
    print(f"  {release_id}: published")
    if level == "available":
        sha = release["manifest_sha256"]
        must(call("POST", f"/api/cloud/marketplace/releases/{release_id}/availability", "publisher",
                  {"level": "available", "evidence_ref": "local-e2e-seed", "manifest_sha256": sha}), f"attest {release_id}")
        print(f"  {release_id}: attested available")
    else:
        print(f"  {release_id}: left as preview (no attestation)")

# Roadmap items: slug is the website id, in the website's own words. A linked item
# leaves the words it does not need to set (summary, category) empty and takes the
# release's, which is what the public roadmap does for it.
# (slug, kind, name, summary, category, horizon, requires, limitations, release_slug, sort)
M = "module"
ITEMS = [
    ("pos", M, "Sales and point of sale", "Sell, take cash or mobile money, and see every sale.", "", "building", ["inventory"], [], "erp-sell", 1),
    ("inventory", M, "Inventory and stock", "Know what you have and when to restock.", "", "building", [], [], "erp-stock", 2),
    ("purchasing", M, "Purchasing and suppliers", "Track what you buy and what you owe suppliers.", "", "building", ["inventory"], ["Purchase orders and supplier bills."], "erp-buy", 3),
    ("accounting", M, "Accounting and tax", "Track money in and out, and your tax figures.", "Money", "next", [], [], "", 10),
    ("reports", M, "Reports and owner dashboards", "See the business on one screen.", "Operations", "next", [], [], "", 11),
    ("card-payments", "feature", "Card payments", "Take card payments at the till.", "Sell", "next", [], [], "", 12),
    ("receipt-printers", "feature", "Receipt printers", "Print a receipt for each sale.", "Sell", "next", [], [], "", 13),
    ("kra-etims", "feature", "KRA eTIMS tax receipts", "Issue tax receipts that meet KRA rules.", "Money", "next", [], [], "", 14),
    ("crm", M, "Customers (CRM) and support", "Keep customer details and answer questions.", "Customers", "later", [], [], "", 20),
    ("people", M, "People, payroll and leave", "Keep staff records, pay salaries and manage leave.", "People", "later", [], [], "", 21),
    ("projects", M, "Projects and tasks", "Plan work and track tasks.", "Operations", "later", [], [], "", 22),
    ("documents", M, "Documents and approvals", "Store documents and get sign-off.", "Operations", "later", [], [], "", 23),
    ("assets", M, "Assets and maintenance", "Track equipment and plan repairs.", "Operations", "later", [], [], "", 24),
    ("subscriptions", M, "Subscriptions and recurring billing", "Bill customers on a schedule.", "Money", "later", [], [], "", 25),
    ("manufacturing", M, "Manufacturing and bills of materials", "Turn materials into products with a recipe.", "Operations", "later", [], [], "", 26),
    ("fleet", M, "Fleet and delivery", "Manage vehicles, drivers and deliveries.", "Operations", "later", [], [], "", 27),
    ("integrations", M, "Integrations and AI tools", "Connect other tools. AI agents later.", "Connect", "later", [], [], "", 28),
]

def main():
    print("releases:")
    for r in RELEASES:
        publish(*r)
    print("templates:")
    for slug, name, summary, doctype, composition in TEMPLATES:
        publish(slug, name, summary, doctype, "preview", kind="template", composition=composition)
    print("roadmap items:")
    for slug, kind, name, summary, category, horizon, requires, limits, release_slug, sort in ITEMS:
        item = {"slug": slug, "kind": kind, "name": name, "summary": summary, "category": category, "horizon": horizon, "requires": requires,
                "limitations": limits, "release_slug": release_slug, "sort": sort}
        must(call("PUT", "/api/cloud/roadmap-items", "admin", item), f"roadmap {slug}")
    print(f"  {len(ITEMS)} items saved")

if __name__ == "__main__":
    main()

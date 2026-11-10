#!/usr/bin/env python3
"""Seed a disposable Kora Cloud with the data the website shows.

Publishes three module releases through the real review flow (author, reviewer,
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

# Releases: website id -> (release slug, name, summary, doctype, availability)
RELEASES = [
    ("erp-sell", "Sales and point of sale", "Sell, take cash or mobile money, and see every sale.", "POS Sale", "available"),
    ("erp-stock", "Inventory and stock", "Know what you have and when to restock.", "Stock Item", "available"),
    ("erp-buy", "Purchasing and suppliers", "Track what you buy and what you owe suppliers.", "Purchase Order", "preview"),
]

def publish(slug, name, summary, doctype, level):
    release_id = f"{slug}-1.0.0"
    manifest = {"schema_version": 1, "package_id": slug, "release_id": release_id, "version": "1.0.0", "kind": "module",
                "public": {"slug": slug, "name": name, "summary": summary},
                "exports": {"doctypes": [doctype], "capabilities": [slug + ".use"]},
                "engine": {"min_version": "1.0.0"}}
    files = [{"path": f"doctypes/{slug}.yaml", "content_type": "doctype", "content": f"name: {doctype}\nmodule: {name}\nfields: []\n"}]
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

# Roadmap items mirror src/lib/modules-content.ts: slug is the website id.
M = "module"
ITEMS = [
    ("pos", M, "Sales and point of sale", "Sell, take cash or mobile money, and see every sale.", "building", ["inventory"], [], "erp-sell", 1),
    ("inventory", M, "Inventory and stock", "Know what you have and when to restock.", "building", [], [], "erp-stock", 2),
    ("purchasing", M, "Purchasing and suppliers", "Track what you buy and what you owe suppliers.", "building", ["inventory"], ["Purchase orders and supplier bills."], "erp-buy", 3),
    ("accounting", M, "Accounting and tax", "Track money in and out, and your tax figures.", "next", [], [], "", 10),
    ("reports", M, "Reports and owner dashboards", "See the business on one screen.", "next", [], [], "", 11),
    ("card-payments", "feature", "Card payments", "Take card payments at the till.", "next", [], [], "", 12),
    ("receipt-printers", "feature", "Receipt printers", "Print a receipt for each sale.", "next", [], [], "", 13),
    ("kra-etims", "feature", "KRA eTIMS tax receipts", "Issue tax receipts that meet KRA rules.", "next", [], [], "", 14),
    ("crm", M, "Customers (CRM) and support", "Keep customer details and answer questions.", "later", [], [], "", 20),
    ("people", M, "People, payroll and leave", "Keep staff records, pay salaries and manage leave.", "later", [], [], "", 21),
    ("projects", M, "Projects and tasks", "Plan work and track tasks.", "later", [], [], "", 22),
    ("documents", M, "Documents and approvals", "Store documents and get sign-off.", "later", [], [], "", 23),
    ("assets", M, "Assets and maintenance", "Track equipment and plan repairs.", "later", [], [], "", 24),
    ("subscriptions", M, "Subscriptions and recurring billing", "Bill customers on a schedule.", "later", [], [], "", 25),
    ("manufacturing", M, "Manufacturing and bills of materials", "Turn materials into products with a recipe.", "later", [], [], "", 26),
    ("fleet", M, "Fleet and delivery", "Manage vehicles, drivers and deliveries.", "later", [], [], "", 27),
    ("integrations", M, "Integrations and AI tools", "Connect other tools. AI agents later.", "later", [], [], "", 28),
]

def main():
    print("releases:")
    for r in RELEASES:
        publish(*r)
    print("roadmap items:")
    for slug, kind, name, summary, horizon, requires, limits, release_slug, sort in ITEMS:
        item = {"slug": slug, "kind": kind, "name": name, "summary": summary, "horizon": horizon, "requires": requires,
                "limitations": limits, "release_slug": release_slug, "sort": sort}
        must(call("PUT", "/api/cloud/roadmap-items", "admin", item), f"roadmap {slug}")
    print(f"  {len(ITEMS)} items saved")

if __name__ == "__main__":
    main()

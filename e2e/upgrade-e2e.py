#!/usr/bin/env python3
"""Upgrade a live workspace to a newer template release, end to end through the real APIs.

It publishes its own fixture releases (a template "upg-demo" at 1.0.0, 1.1.0 and 1.2.0 over one
module with one record type), signs up two workspaces on 1.0.0, and checks what an operator's
plan and apply do:

  workspace A (holds records)  1.0.0 -> 1.1.0 adds an optional field: allowed, records kept
                               1.1.0 -> 1.2.0 adds a unique field: refused, nothing changes
  workspace B (no records)     1.0.0 -> 1.2.0: allowed, and the unique rule is enforced

Needs the stack in e2e/stack.md (Cloud, an Engine with the upgrade guard, a mail catcher):
  CLOUD=... ENGINE=... MAILPIT=... ADMIN=... AUTHOR=... REVIEWER=... PUBLISHER=... python3 e2e/upgrade-e2e.py
"""
import importlib.util, json, os, re, sys, time, urllib.error, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("seed", os.path.join(HERE, "seed-cloud.py"))
seed = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seed)

CLOUD = os.environ.get("CLOUD", "http://127.0.0.1:18081").rstrip("/")
ENGINE = os.environ.get("ENGINE", "http://127.0.0.1:18000").rstrip("/")
MAILPIT = os.environ.get("MAILPIT", "http://127.0.0.1:18025").rstrip("/")
PASSWORD = "correct-horse-battery-9"
RUN = str(int(time.time()))
failures = []


def http(method, url, body=None, headers=None):
    data = None if body is None else json.dumps(body).encode()
    request = urllib.request.Request(url, method=method, data=data, headers={"Content-Type": "application/json", **(headers or {})})
    try:
        with urllib.request.urlopen(request, timeout=60) as res:
            raw = res.read()
            return res.status, (json.loads(raw) if raw else None), res.headers
    except urllib.error.HTTPError as err:
        raw = err.read().decode()
        try:
            return err.code, json.loads(raw), err.headers
        except ValueError:
            return err.code, {"error": raw}, err.headers


def check(what, ok, detail=""):
    print(("  ok    " if ok else "  FAIL  ") + what + ("" if ok else f"   {detail}"))
    if not ok:
        failures.append(what)


TITLE = ("title", "Data", "Title", {"in_list_view": True})
PRIORITY = ("priority", "Select", "Priority", {"options": ["Low", "Normal", "High"], "in_list_view": True})
REFERENCE = ("reference", "Data", "Reference", {"unique": True, "in_list_view": True})
# What each version of the one record type holds: 1.1.0 adds an optional field, 1.2.0 a unique one.
VERSIONS = {"1.0.0": [TITLE], "1.1.0": [TITLE, PRIORITY], "1.2.0": [TITLE, PRIORITY, REFERENCE]}


def publish_fixtures():
    for version, fields in VERSIONS.items():
        seed.publish("upg-notes", "Upg Notes", "Notes for the upgrade test.", "Upg Note", "available", version=version, spec=("title", fields))
        seed.publish("upg-demo", "Upg Demo", "A template for the upgrade test.", "Upg Demo", "preview", kind="template",
                     composition=[(seed.rid("upg-notes", version), "required")], version=version, spec=("title", [TITLE]))


def sign_up(label):
    email = f"upg.{label}.{RUN}@example.com"
    body = {"full_name": "Upgrade Tester", "email": email, "password": PASSWORD, "organization_name": f"Upgrade {label} {RUN}",
            "template_selection": {"template_release_id": "upg-demo-1.0.0", "optional_release_ids": []}}
    key = f"upgrade-e2e-{label}-{RUN}"
    for _ in range(60):
        status, payload, _ = http("POST", CLOUD + "/api/cloud/signup", body, {"Idempotency-Key": key})
        if status == 201:
            break
        if status != 202:
            sys.exit(f"signup {label}: {status} {payload}")
        time.sleep(3)
    else:
        sys.exit(f"signup {label}: workspace was not ready in time")
    mail = http("GET", f"{MAILPIT}/api/v1/search?query=to:{email}")[1]["messages"][0]["ID"]
    text = http("GET", f"{MAILPIT}/api/v1/message/{mail}")[1]["Text"]
    token = re.search(r"#token=([A-Za-z0-9]+)", text).group(1)
    status, verified, _ = http("POST", CLOUD + "/api/cloud/auth/email/verify", {"token": token})
    tenant = verified["tenant_id"]
    status, _, headers = http("POST", f"{ENGINE}/s/{tenant}/api/auth/cloud/handoff", {"code": verified["handoff_code"]})
    if status != 200:
        sys.exit(f"handoff {label}: {status}")
    cookies = {c.split("=", 1)[0]: c.split("=", 1)[1].split(";")[0] for c in headers.get_all("Set-Cookie")}
    return tenant, {"Cookie": f"kora_sid={cookies['kora_sid']}; kora_csrf={cookies['kora_csrf']}", "X-Kora-CSRF-Token": cookies["kora_csrf"]}


def engine(tenant, session, method, path, body=None):
    return http(method, f"{ENGINE}/s/{tenant}/api/v1{path}", body, session)


def fields_of(tenant, session):
    status, payload, _ = engine(tenant, session, "GET", "/system/doctype/upg-note")
    return [f["fieldname"] for f in (payload["data"]["doctype"]["fields"] or [])] if status == 200 else []


def upgrade(site, release=None, digest=None):
    ask = {"site_id": site, **({"template_release_id": release} if release else {})}
    headers = {"Authorization": "Bearer " + seed.TOKENS["admin"], "X-Support-Reason": "upgrade e2e"}
    plan = http("POST", CLOUD + "/api/cloud/sites/upgrade-package/plan", ask, headers)[1]
    applied = http("POST", CLOUD + "/api/cloud/sites/upgrade-package", {**ask, "plan_digest": digest or plan.get("plan_digest", "")}, headers)
    return plan, applied[0], applied[1]


def listed(site):
    items = http("GET", CLOUD + "/api/cloud/sites?id=" + site, headers={"Authorization": "Bearer " + seed.TOKENS["admin"]})[1]["items"]
    return items[0]


def main():
    print("publishing fixture releases")
    publish_fixtures()

    print("workspace A: records, then a safe upgrade, then an unsafe one")
    a, session_a = sign_up("a")
    for title in ("one", "two", "three"):
        engine(a, session_a, "POST", "/resource/upg-note", {"title": title})
    check("A starts with title only", fields_of(a, session_a) == ["title"], fields_of(a, session_a))
    site = listed(a)
    check("Cloud shows A on 1.0.0 and outdated", site["package"]["template_release_id"] == "upg-demo-1.0.0" and site["outdated"] and site["latest_release_id"] == "upg-demo-1.2.0", site.get("package"))

    plan, status, out = upgrade(a, "upg-demo-1.1.0")
    check("plan to 1.1.0 is upgradeable and names the change", plan["upgradeable"] and any(c["package_id"] == "upg-notes" and c["change"] == "upgrade" for c in plan["components"]), plan)
    check("apply of the plan succeeds", status == 200 and out["status"] == "upgraded", f"{status} {out}")
    check("A gained the optional field", fields_of(a, session_a) == ["title", "priority"], fields_of(a, session_a))
    rows = engine(a, session_a, "GET", "/resource/upg-note")[1]["data"]
    check("A's three records are intact", sorted(r["title"] for r in rows) == ["one", "three", "two"], rows)
    check("a record with the new field saves", engine(a, session_a, "POST", "/resource/upg-note", {"title": "four", "priority": "High"})[0] == 201)
    site = listed(a)
    check("Cloud shows the upgrade recorded, still outdated against 1.2.0", site["package"]["source"] == "upgrade" and site["package"]["template_release_id"] == "upg-demo-1.1.0" and site["outdated"], site.get("package"))
    _, status, out = upgrade(a, "upg-demo-1.1.0", plan["plan_digest"])
    check("applying the same plan again is refused, not repeated", status == 409 and out.get("error") == "not_upgradeable", f"{status} {out}")

    plan, status, out = upgrade(a, "upg-demo-1.2.0")
    check("plan to 1.2.0 looks fine to Cloud (it cannot see records)", plan["upgradeable"], plan)
    check("the Engine refuses a unique field on a table with records", status == 409 and out.get("error") == "upgrade_refused" and "4 records" in out.get("message", "") and "unique field" in out.get("message", ""), f"{status} {out}")
    check("the refusal changed nothing", fields_of(a, session_a) == ["title", "priority"] and listed(a)["package"]["template_release_id"] == "upg-demo-1.1.0", fields_of(a, session_a))

    print("workspace B: no records, straight to the unique field")
    b, session_b = sign_up("b")
    plan, status, out = upgrade(b)
    check("B upgrades to the newest release by default", status == 200 and plan["to_template_release_id"] == "upg-demo-1.2.0", f"{status} {plan.get('to_template_release_id')} {out}")
    check("B has the unique field", "reference" in fields_of(b, session_b), fields_of(b, session_b))
    first = engine(b, session_b, "POST", "/resource/upg-note", {"title": "x", "reference": "R-1"})[0]
    second = engine(b, session_b, "POST", "/resource/upg-note", {"title": "y", "reference": "R-1"})[0]
    check("the unique rule is enforced after an upgrade (409 on a duplicate)", first == 201 and second == 409, f"{first} then {second}")
    check("Cloud shows B current", listed(b)["outdated"] is False)

    print()
    if failures:
        print(f"{len(failures)} check(s) failed")
        sys.exit(1)
    print("all checks passed")


if __name__ == "__main__":
    main()

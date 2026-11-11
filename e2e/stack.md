# Running the whole onboarding loop locally

The site finishes onboarding itself: it creates the account, follows the setup, and opens the emailed link at its own `/verify` page, which hands the customer to the workspace. Cloud's portal is not part of that path (it stays for people who come back and sign in). Set the site's `VITE_KORA_APP_BASE_URL` to enable it; without it the picker's last button still goes to the portal.

`run.sh` needs a disposable Kora Cloud and drives the website against it. To go further
(signup, provisioning, email verification, the workspace) the stack needs more wiring than
the short runbook in `kora-cloud/docs/local-disposable-stack.md` gives. Everything below was
needed for the loop to finish; a missing item shows up as the failure named beside it.

## Services

| Service | Port used here | Notes |
|---|---|---|
| MySQL 8 | 13390 | Create the Cloud database with `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`. Without it, signup verification fails with "Illegal mix of collations" and the API says only "could not look up the workspace". |
| Engine | 18000 | |
| Cloud | 18081 | |
| Mail catcher (Mailpit) | SMTP 11025, UI 18025 | The log mailer records only the recipient and subject, never the link, so a local run cannot read the verification email without a catcher. |
| Customer portal (`kora-cloud/web`) | 18176 | Only for signing in again, or when the site has no `VITE_KORA_APP_BASE_URL`. `KORA_CLOUD_WEB_API_TARGET` = Cloud, `VITE_KORA_STUDIO_BASE_URL` = Studio. |
| Studio (`kora-ui`) | 18173 | `VITE_ENGINE_URL` = Engine, `VITE_CLOUD_URL` = Cloud, `KORA_DEV_CLOUD_ORIGINS` = the origins that redeem the handoff, the site's and the portal's (else the call is blocked by CORS). |
| Website | 4800 | `VITE_KORA_CLOUD_CATALOG_BASE_URL` = Cloud, `VITE_KORA_APP_BASE_URL` = Studio (turns on onboarding in the site), `VITE_KORA_CLOUD_SIGNUP_URL` = the portal's `/signup` (the fallback, and the sign-in link). Cloud's CORS list must include the site's origin. |

## Cloud settings beyond the basics

| Setting | Why | Without it |
|---|---|---|
| `KORA_CLOUD_ENGINE_MANAGEMENT_PROVISIONING=true`, `..._DEPLOYMENT`, `..._DATABASE_ALLOCATION_REF` | Cloud creates tenants through the Engine's management API. The last two must equal the Engine's `KORA_ENGINE_DEPLOYMENT_ID` and `KORA_ENGINE_MANAGEMENT_DATABASE_ALLOCATION_REF`. | Signup answers 400 "workspace provisioning could not start" (the real cause, "Engine management provisioning is disabled", is not logged). |
| `KORA_CLOUD_ENGINE_MANAGEMENT_PACKAGES=true`, `KORA_CLOUD_ENGINE_ARTIFACT_TOKEN` | Cloud applies the chosen template. Engine side: `KORA_ENGINE_MANAGEMENT_ARTIFACT_URL` (Cloud) and the same token as `KORA_ENGINE_MANAGEMENT_ARTIFACT_TOKEN`. | The Engine does not advertise `tenant.package.apply`; signup is refused. |
| `KORA_CLOUD_ENGINE_PROVISIONING_TOKEN` | Must equal the Engine's `KORA_ENGINE_PROVISIONING_TOKEN` and `KORA_ENGINE_CLOUD_IDENTITY_TOKEN`. Engine also needs `KORA_ENGINE_CLOUD_IDENTITY_URL` = Cloud's `/internal/identity/handoff/redeem`. | Provisioning stops at `configure_channel_client` with a 401, and a repeated signup keeps answering "provisioning" until an operator retries the job. |
| `KORA_CLOUD_EMAIL_MODE=smtp`, `KORA_CLOUD_SMTP_HOST`, `..._PORT`, `KORA_CLOUD_SMTP_TLS_MODE=plain` | Deliver mail to the catcher. | See Mail catcher above. |
| `KORA_CLOUD_SIGNUP_VERIFY_BASE_URL` | The origin the verification email links to: the site, which serves `/verify`. Sign-in emails keep using `KORA_CLOUD_WEB_BASE_URL` (the portal), so the two are separate. | The link goes to `KORA_CLOUD_WEB_BASE_URL`, else Cloud's API origin, which serves no `/verify` page. |

## The loop

1. Website `/start`: choose a business, tick modules, "Continue to create account" (step 2 of 3).
2. Still on the site, step 3 of 3: name, business, email, password. The site checks each field against Cloud's rules (Cloud itself answers every bad field with one sentence) and posts `POST /api/cloud/signup`.
3. The site repeats that request with one Idempotency-Key until Cloud answers 201 (about 20 to 30 seconds), showing "Setting up ...".
4. "Check your email". Open the link from the catcher: it lands on the site's `/verify`, which verifies, redeems the handoff code at Studio and goes to the workspace.
5. In the workspace, "Open POS Sale", "Add row", a reference and a total, "Save row": the sale is saved (`GET /s/<tenant>/api/v1/resource/pos-sale` returns it). This needs the seed's record types to have fields; the seed publishes them from version 1.1.0 (1.0.0 had none, which the Engine accepts but which leaves nothing to fill in), and the newest published release of a slug is the one the catalog shows.

Cloud allows 10 new workspace setups per connection per hour (5 per email). One flow run uses one; when iterating by hand, clear the rows in the `auth_rate_limits` table whose `rate_key` starts with `cloud-signup-selection`.

`run.sh` runs flow 12 (this whole loop) when `STUDIO` (for example `http://127.0.0.1:18173`) and `MAILPIT` (for example `http://127.0.0.1:18025`) are set; otherwise it is skipped.

Check the Engine's advertised capabilities with `GET /api/management/v2/capabilities`; it must list
`tenant.package.apply` and `tenant.provision`.

## Upgrading a live workspace

A workspace made from an older release of a template can be moved to a newer one by an operator (the
`upgrade-package/plan` and `upgrade-package` calls, which need the operator token and a support reason).
`e2e/upgrade-e2e.py` checks the whole path through the real APIs on this stack: it publishes its own
fixture releases, signs up two workspaces, and asserts a safe upgrade keeps records and adds fields, an
upgrade that would add a unique field to a table that holds records is refused with the reason, the same
change on an empty table works and the unique rule is then enforced, and `GET /api/cloud/sites` shows
who is on which release and who is outdated.

```
CLOUD=... ENGINE=... MAILPIT=... ADMIN=... AUTHOR=... REVIEWER=... PUBLISHER=... python3 e2e/upgrade-e2e.py
```

It needs an Engine that has both upgrade fixes: a unique field gets its unique index on an existing table,
and a package that would invalidate existing records is refused before any change. Run against an Engine
without them it fails exactly those checks. Give a freshly restarted Engine a minute before running it:
creating a workspace while it is still loading tenants can take longer than Cloud will wait.

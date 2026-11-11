# Running the whole onboarding loop locally

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
| Customer portal (`kora-cloud/web`) | 18176 | `KORA_CLOUD_WEB_API_TARGET` = Cloud, `VITE_KORA_STUDIO_BASE_URL` = Studio. |
| Studio (`kora-ui`) | 18173 | `VITE_ENGINE_URL` = Engine, `VITE_CLOUD_URL` = Cloud, `KORA_DEV_CLOUD_ORIGINS` = the portal's origin (else the handoff call is blocked by CORS). |
| Website | 4800 | `VITE_KORA_CLOUD_CATALOG_BASE_URL` = Cloud, `VITE_KORA_CLOUD_SIGNUP_URL` = the portal's `/signup`. |

## Cloud settings beyond the basics

| Setting | Why | Without it |
|---|---|---|
| `KORA_CLOUD_ENGINE_MANAGEMENT_PROVISIONING=true`, `..._DEPLOYMENT`, `..._DATABASE_ALLOCATION_REF` | Cloud creates tenants through the Engine's management API. The last two must equal the Engine's `KORA_ENGINE_DEPLOYMENT_ID` and `KORA_ENGINE_MANAGEMENT_DATABASE_ALLOCATION_REF`. | Signup answers 400 "workspace provisioning could not start" (the real cause, "Engine management provisioning is disabled", is not logged). |
| `KORA_CLOUD_ENGINE_MANAGEMENT_PACKAGES=true`, `KORA_CLOUD_ENGINE_ARTIFACT_TOKEN` | Cloud applies the chosen template. Engine side: `KORA_ENGINE_MANAGEMENT_ARTIFACT_URL` (Cloud) and the same token as `KORA_ENGINE_MANAGEMENT_ARTIFACT_TOKEN`. | The Engine does not advertise `tenant.package.apply`; signup is refused. |
| `KORA_CLOUD_ENGINE_PROVISIONING_TOKEN` | Must equal the Engine's `KORA_ENGINE_PROVISIONING_TOKEN` and `KORA_ENGINE_CLOUD_IDENTITY_TOKEN`. Engine also needs `KORA_ENGINE_CLOUD_IDENTITY_URL` = Cloud's `/internal/identity/handoff/redeem`. | Provisioning stops at `configure_channel_client` with a 401, and a repeated signup keeps answering "provisioning" until an operator retries the job. |
| `KORA_CLOUD_EMAIL_MODE=smtp`, `KORA_CLOUD_SMTP_HOST`, `..._PORT`, `KORA_CLOUD_SMTP_TLS_MODE=plain` | Deliver mail to the catcher. | See Mail catcher above. |
| `KORA_CLOUD_WEB_BASE_URL` | The portal's origin, used for the link in the verification email. | The link points at Cloud's API origin, which serves no `/verify` page. |

## The loop

1. Website `/start`: choose a business, tick modules, "Continue to create account".
2. Portal `/signup?template=…&optional=…`: the carried choice is shown again; Continue; name, workspace, email, password.
3. The portal repeats `POST /api/cloud/signup` with one Idempotency-Key until Cloud answers 201 (about 20 to 30 seconds).
4. Open the link from the catcher. The portal verifies, asks Cloud for a handoff code, redeems it at Studio, and lands in the workspace.

Check the Engine's advertised capabilities with `GET /api/management/v2/capabilities`; it must list
`tenant.package.apply` and `tenant.provision`.

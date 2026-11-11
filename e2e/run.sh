#!/usr/bin/env bash
# End-to-end check of the website against a running Kora Cloud, driven by Maestro.
#
# It needs a Cloud you can write to (a disposable stack, never production):
#   CLOUD     base URL, e.g. http://127.0.0.1:18081
#   ADMIN, AUTHOR, REVIEWER, PUBLISHER   that Cloud's operator and marketplace tokens
# and that Cloud's CORS list must allow http://127.0.0.1:4800 and :4801.
# Flow 12 (the whole onboarding) also needs STUDIO (where workspaces open) and MAILPIT
# (the mail catcher); without them it is skipped. See e2e/stack.md.
#
# It seeds Cloud (idempotent), starts the website twice (one pointed at Cloud, one at a
# closed port), runs every flow in e2e/maestro/flows, then stops what it started.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${CLOUD:?set CLOUD}" "${ADMIN:?set ADMIN}" "${AUTHOR:?set AUTHOR}" "${REVIEWER:?set REVIEWER}" "${PUBLISHER:?set PUBLISHER}"
export CLOUD ADMIN AUTHOR REVIEWER PUBLISHER
UP=4800 DOWN=4801
BASE="http://127.0.0.1:$UP" BASE_DOWN="http://127.0.0.1:$DOWN"
OUT="${OUT:-$(mktemp -d)}"; mkdir -p "$OUT"
PIDS=()
stop() { for pid in "${PIDS[@]:-}"; do [ -n "$pid" ] && kill "$pid" 2>/dev/null || true; done; }
trap stop EXIT

for port in $UP $DOWN; do
  if (exec 3<>/dev/tcp/127.0.0.1/$port) 2>/dev/null; then echo "port $port is already in use" >&2; exit 1; fi
done

python3 -I e2e/seed-cloud.py

serve() { # port, catalog base URL
  VITE_KORA_CLOUD_CATALOG_BASE_URL="$2" VITE_KORA_APP_BASE_URL="${STUDIO:-}" bunx vite --host 127.0.0.1 --port "$1" --strictPort >"$OUT/site-$1.log" 2>&1 &
  PIDS+=("$!")
  for _ in $(seq 1 40); do curl -sf -o /dev/null "http://127.0.0.1:$1/" && return 0; sleep 0.5; done
  echo "site on $1 did not start; see $OUT/site-$1.log" >&2; exit 1
}
serve $UP "$CLOUD"
serve $DOWN "http://127.0.0.1:1"

status=0
for flow in e2e/maestro/flows/*.yaml; do
  case "$(basename "$flow")" in
    12-*) if [ -z "${STUDIO:-}" ] || [ -z "${MAILPIT:-}" ]; then echo "== $(basename "$flow") skipped (set STUDIO and MAILPIT)"; continue; fi ;;
  esac
  echo "== $(basename "$flow")"
  maestro -p web test --headless --screen-size 1280x4000 --test-output-dir "$OUT/$(basename "$flow" .yaml)" \
    -e BASE="$BASE" -e BASE_DOWN="$BASE_DOWN" -e CLOUD="$CLOUD" -e ADMIN="$ADMIN" -e AUTHOR="$AUTHOR" -e PUBLISHER="$PUBLISHER" -e STUDIO="${STUDIO:-}" -e MAILPIT="${MAILPIT:-}" \
    "$flow" || status=1
done
echo "results and screenshots: $OUT"
exit $status

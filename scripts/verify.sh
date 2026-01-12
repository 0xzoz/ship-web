#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running verify gates..."

has_cmd() { command -v "$1" >/dev/null 2>&1; }

run_node() {
  if npm run --silent 2>/dev/null | grep -q "lint"; then
    echo "→ Lint"
    npm run lint || { echo "❌ Lint failed"; exit 1; }
  fi

  if npm run --silent 2>/dev/null | grep -q "typecheck"; then
    echo "→ Typecheck"
    npm run typecheck || { echo "❌ Typecheck failed"; exit 1; }
  fi

  if [ -x ./scripts/test.sh ]; then
    echo "→ Test"
    ./scripts/test.sh || { echo "❌ Tests failed"; exit 1; }
  elif npm run --silent 2>/dev/null | grep -q "test"; then
    echo "→ Test"
    npm run test || { echo "❌ Tests failed"; exit 1; }
  fi

  if npm run --silent 2>/dev/null | grep -q "build"; then
    echo "→ Build"
    npm run build || { echo "❌ Build failed"; exit 1; }
  fi
}

run_workspace_typecheck() {
  if [ -f apps/web/package.json ] && [ -d apps/web/node_modules ] && npm --workspace apps/web run --silent 2>/dev/null | grep -q "typecheck"; then
    echo "→ Typecheck (web)"
    npm --workspace apps/web run typecheck || { echo "❌ Web typecheck failed"; exit 1; }
  fi

  if [ -f apps/api/package.json ] && [ -d apps/api/node_modules ] && npm --workspace apps/api run --silent 2>/dev/null | grep -q "typecheck"; then
    echo "→ Typecheck (api)"
    npm --workspace apps/api run typecheck || { echo "❌ API typecheck failed"; exit 1; }
  fi
}

run_smoke() {
  if [ ! -d apps/web/node_modules ] || [ ! -d apps/api/node_modules ]; then
    echo "⏭️  Dependencies not installed, skipping smoke test"
    return 0
  fi

  echo "→ Smoke test (servers start)"
  api_log="/tmp/ship-api-smoke.log"
  web_log="/tmp/ship-web-smoke.log"
  api_ready=0
  web_ready=0

  cleanup() {
    if [ -n "${API_PID:-}" ] && kill -0 "$API_PID" 2>/dev/null; then
      kill "$API_PID" 2>/dev/null || true
    fi
    if [ -n "${WEB_PID:-}" ] && kill -0 "$WEB_PID" 2>/dev/null; then
      kill "$WEB_PID" 2>/dev/null || true
    fi
  }
  trap cleanup EXIT

  npm --workspace apps/api run dev >"$api_log" 2>&1 &
  API_PID=$!

  for _ in $(seq 1 20); do
    if curl -fsS "http://localhost:3001/api/health" >/dev/null 2>&1; then
      api_ready=1
      break
    fi
    sleep 1
  done

  if [ "$api_ready" -ne 1 ]; then
    echo "❌ API server not ready on http://localhost:3001"
    echo "   Logs: $api_log"
    exit 1
  fi

  npm --workspace apps/web run dev >"$web_log" 2>&1 &
  WEB_PID=$!

  for _ in $(seq 1 20); do
    if curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
      web_ready=1
      break
    fi
    sleep 1
  done

  if [ "$web_ready" -ne 1 ]; then
    echo "❌ Web server not ready on http://localhost:3000"
    echo "   Logs: $web_log"
    exit 1
  fi
}

run_python() {
  if [ -x ./scripts/test.sh ]; then
    echo "→ Test"
    ./scripts/test.sh || { echo "❌ Tests failed"; exit 1; }
    return 0
  fi

  if has_cmd python && python -c "import pytest" >/dev/null 2>&1; then
    echo "→ Test (pytest)"
    python -m pytest || { echo "❌ Tests failed"; exit 1; }
    return 0
  fi

  if has_cmd pytest; then
    echo "→ Test (pytest)"
    pytest || { echo "❌ Tests failed"; exit 1; }
    return 0
  fi

  echo "ℹ️  Python detected but no test runner found."
}

run_go() {
  if ! has_cmd go; then
    echo "ℹ️  Go detected but 'go' not found."
    return 0
  fi
  echo "→ Test (go)"
  go test ./... || { echo "❌ Tests failed"; exit 1; }
}

run_rust() {
  if ! has_cmd cargo; then
    echo "ℹ️  Rust detected but 'cargo' not found."
    return 0
  fi
  echo "→ Test (cargo)"
  cargo test || { echo "❌ Tests failed"; exit 1; }
}

ran_any=0

if [ -f package.json ]; then
  ran_any=1
  run_node
  run_workspace_typecheck
  run_smoke
fi

if [ -f pyproject.toml ] || [ -f requirements.txt ] || [ -f setup.py ]; then
  ran_any=1
  run_python
fi

if [ -f go.mod ]; then
  ran_any=1
  run_go
fi

if [ -f Cargo.toml ]; then
  ran_any=1
  run_rust
fi

if [ -x ./scripts/test-ui.sh ]; then
  echo "→ UI tests"
  ./scripts/test-ui.sh || { echo "❌ UI tests failed"; exit 1; }
  ran_any=1
fi

if [ -f ./scripts/check-console.js ]; then
  if has_cmd node; then
    if node -e "require.resolve('puppeteer')" >/dev/null 2>&1; then
      echo "→ Console check"
      node ./scripts/check-console.js || { echo "❌ Console check failed"; exit 1; }
      ran_any=1
    else
      echo "⏭️  Puppeteer not installed, skipping console check"
    fi
  else
    echo "ℹ️  Node not found. Skipping console check."
  fi
fi

if [ "$ran_any" -eq 0 ]; then
  echo "⚠️  No recognized project type — customize scripts/verify.sh for this project"
  exit 0
fi

echo "✅ All gates passed"

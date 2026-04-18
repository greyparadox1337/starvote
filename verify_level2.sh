#!/usr/bin/env bash
# ============================================================
#  StarVote — Antigravity x Stellar Level 2 Requirement Check
# ============================================================
#  Run this from the root of your project directory:
#    chmod +x verify_level2.sh && ./verify_level2.sh
# ============================================================

PASS=0
FAIL=0
WARN=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

pass() { echo -e "  ${GREEN}✅ PASS${RESET}  $1"; ((PASS++)); }
fail() { echo -e "  ${RED}❌ FAIL${RESET}  $1"; ((FAIL++)); }
warn() { echo -e "  ${YELLOW}⚠️  WARN${RESET}  $1"; ((WARN++)); }
header() { echo -e "\n${CYAN}${BOLD}━━━  $1  ━━━${RESET}"; }

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║   Antigravity x Stellar — Level 2 Audit Script  ║${RESET}"
echo -e "${BOLD}╚══════════════════════════════════════════════════╝${RESET}"
echo -e "  Directory: ${CYAN}$(pwd)${RESET}"
echo -e "  Date:      $(date '+%Y-%m-%d %H:%M')"


# ─────────────────────────────────────────────
header "1. PROJECT STRUCTURE"
# ─────────────────────────────────────────────

if [ -f "package.json" ]; then
  pass "package.json found"
else
  fail "package.json not found — is this a Node/Next.js project?"
fi

if [ -f "README.md" ] || [ -f "readme.md" ] || [ -f "README.MD" ]; then
  pass "README file found"
else
  fail "README.md missing — required for submission"
fi

SRC_DIR=""
for d in src app pages components; do
  if [ -d "$d" ]; then SRC_DIR="$d"; break; fi
done

if [ -n "$SRC_DIR" ]; then
  pass "Source directory found: $SRC_DIR/"
else
  warn "Could not detect a source directory (src/, app/, pages/)"
fi


# ─────────────────────────────────────────────
header "2. GIT COMMITS (min 2 meaningful)"
# ─────────────────────────────────────────────

if git rev-parse --is-inside-work-tree &>/dev/null; then
  COMMIT_COUNT=$(git log --oneline | wc -l | tr -d ' ')
  if [ "$COMMIT_COUNT" -ge 2 ]; then
    pass "$COMMIT_COUNT commits found"
  else
    fail "Only $COMMIT_COUNT commit(s) — need at least 2 meaningful commits"
  fi

  echo ""
  echo -e "  ${BOLD}Last 5 commits:${RESET}"
  git log --oneline -5 | while read -r line; do
    echo -e "    ${CYAN}→${RESET} $line"
  done

  # Warn if commits look like boilerplate
  BOILERPLATE=$(git log --oneline | grep -iE "^[a-f0-9]+ (initial commit|init|first commit|update|fix)$" | wc -l | tr -d ' ')
  if [ "$BOILERPLATE" -gt 0 ]; then
    warn "$BOILERPLATE commit(s) have generic messages — reviewers prefer descriptive commits"
  fi
else
  fail "Not a git repository or git not installed"
fi


# ─────────────────────────────────────────────
header "3. STELLAR WALLETS KIT"
# ─────────────────────────────────────────────

if grep -r "stellar-wallets-kit\|StellarWalletsKit" package.json package-lock.json yarn.lock 2>/dev/null | grep -q .; then
  pass "stellar-wallets-kit found in dependencies"
else
  fail "stellar-wallets-kit not found in package.json / lockfile"
fi

if grep -rq "StellarWalletsKit\|stellar-wallets-kit" "$SRC_DIR" 2>/dev/null || grep -rq "StellarWalletsKit\|stellar-wallets-kit" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "StellarWalletsKit used in source code"
else
  fail "StellarWalletsKit not referenced in source files"
fi

WALLET_COUNT=$(grep -r "allowedWallets\|FREIGHTER\|LOBSTR\|XBULL\|RABET\|wallet.*id\|WalletType" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$WALLET_COUNT" -ge 2 ]; then
  pass "Multiple wallet types referenced ($WALLET_COUNT occurrences)"
else
  warn "Could not confirm multi-wallet support — check allowedWallets config"
fi


# ─────────────────────────────────────────────
header "4. ERROR HANDLING (need 3 distinct types)"
# ─────────────────────────────────────────────

ERR_TYPES=0

if grep -rqiE "wallet.*not.*found|no.*wallet|WalletNotFound|isInstalled|not.*installed" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Error type 1: Wallet not found / not installed"
  ((ERR_TYPES++))
else
  fail "Error type 1 missing: Wallet not found / not installed"
fi

if grep -rqiE "rejected|user.*cancel|USER_CANCEL|declined|userCanceled|abort" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Error type 2: User rejected / cancelled"
  ((ERR_TYPES++))
else
  fail "Error type 2 missing: User rejected / cancelled transaction"
fi

if grep -rqiE "insufficient.*balance|balance.*insufficient|INSUFFICIENT_FUNDS|not enough|op_underfunded" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Error type 3: Insufficient balance"
  ((ERR_TYPES++))
else
  fail "Error type 3 missing: Insufficient balance handling"
fi

[ "$ERR_TYPES" -lt 3 ] && warn "Only $ERR_TYPES/3 error types confirmed — need all 3 for Level 2"


# ─────────────────────────────────────────────
header "5. SMART CONTRACT INTEGRATION"
# ─────────────────────────────────────────────

if grep -rqiE "soroban|SorobanRpc|rpc\.SorobanRpc|@stellar/stellar-sdk.*contract|ContractSpec" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" package.json 2>/dev/null; then
  pass "Soroban / smart contract SDK found"
else
  fail "No Soroban/contract SDK usage found — smart contract required for Level 2"
fi

if grep -rqiE "contractId|contract_id|CONTRACT_ID|new Contract\(|SorobanClient\.Contract" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.env*" 2>/dev/null; then
  pass "Contract ID referenced in code"
else
  fail "No contract ID found — deploy contract and reference its address"
fi

if grep -rqiE "invokeHostFunction|call\(|contract\.call|\.invoke\(|prepareTransaction|simulateTransaction" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Contract function call found (invoke/simulate)"
else
  fail "No contract invocation found — frontend must call contract functions"
fi

READ_OP=$(grep -rqiE "simulateTransaction|\.query\(|readOnly|view.*contract|getContractData" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null && echo 1 || echo 0)
WRITE_OP=$(grep -rqiE "invokeHostFunction|submitTransaction|signAndSendTransaction|sendTransaction" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null && echo 1 || echo 0)
if [ "$READ_OP" -eq 1 ] && [ "$WRITE_OP" -eq 1 ]; then
  pass "Both read and write contract operations present"
elif [ "$WRITE_OP" -eq 1 ]; then
  warn "Write operations found but read/query not clearly detected"
else
  fail "Could not confirm both read and write contract operations"
fi


# ─────────────────────────────────────────────
header "6. TRANSACTION STATUS TRACKING"
# ─────────────────────────────────────────────

if grep -rqiE "pending|PENDING|status.*pending" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Pending state referenced"
else
  fail "No 'pending' transaction state found"
fi

if grep -rqiE "success|SUCCESS|status.*success|tx.*success" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Success state referenced"
else
  fail "No 'success' transaction state found"
fi

if grep -rqiE "failed|FAILED|error.*tx|tx.*error|status.*fail" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Failed state referenced"
else
  fail "No 'failed' transaction state found"
fi

if grep -rqiE "getTransaction|txHash|transaction.*hash|transactionHash" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Transaction hash tracking found"
else
  warn "Transaction hash tracking not clearly found — should display tx hash to user"
fi


# ─────────────────────────────────────────────
header "7. REAL-TIME / EVENT LISTENING"
# ─────────────────────────────────────────────

if grep -rqiE "EventSource|stream\(|\.stream|payments.*stream|transactions.*stream" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "Horizon event streaming found"
elif grep -rqiE "setInterval|useInterval|polling|refetch.*interval" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  warn "Polling-based updates found (setInterval) — streaming preferred but polling qualifies"
  ((PASS++))
else
  fail "No real-time event listening or polling found — required for Level 2"
fi

if grep -rqiE "useEffect.*fetch|refetch|mutate|revalidate" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null; then
  pass "State synchronization / re-fetching pattern detected"
else
  warn "State synchronization after events not clearly detected"
fi


# ─────────────────────────────────────────────
header "8. README CONTENT CHECK"
# ─────────────────────────────────────────────

README_FILE=$(find . -maxdepth 1 -iname "readme.md" | head -1)

if [ -n "$README_FILE" ]; then
  README=$(cat "$README_FILE")

  if echo "$README" | grep -qiE "C[A-Z0-9]{55}|contract.*address|deployed.*contract"; then
    pass "Contract address present in README"
  else
    fail "Contract address missing from README — add deployed Soroban contract address"
  fi

  if echo "$README" | grep -qiE "[a-f0-9]{64}|tx.*hash|transaction.*hash|hash.*[a-f0-9]{60}"; then
    pass "Transaction hash present in README"
  else
    fail "Transaction hash missing from README — add a verifiable tx hash"
  fi

  if echo "$README" | grep -qiE "wallet.*screenshot|screenshot.*wallet|!\[.*wallet"; then
    pass "Wallet screenshot reference found in README"
  else
    warn "No wallet screenshot reference found in README (required checklist item)"
  fi

  if echo "$README" | grep -qiE "npm.*install|yarn install|npm run dev|getting started|setup|installation"; then
    pass "Setup instructions present in README"
  else
    fail "Setup instructions missing from README"
  fi

  if echo "$README" | grep -qiE "vercel\.app|netlify\.app|https://"; then
    pass "Live demo link found in README"
  else
    warn "No live demo link in README (optional but recommended)"
  fi
else
  fail "README.md not found — cannot check content"
fi


# ─────────────────────────────────────────────
header "9. TESTNET CONFIGURATION"
# ─────────────────────────────────────────────

if grep -rqiE "testnet|TESTNET|horizon-testnet|soroban-testnet|friendbot" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.env*" 2>/dev/null; then
  pass "Testnet configuration found"
else
  warn "Testnet config not clearly found — ensure you're on Stellar Testnet"
fi

if [ -f ".env" ] || [ -f ".env.local" ] || [ -f ".env.example" ]; then
  pass ".env file present"
  if grep -qiE "CONTRACT|STELLAR|SOROBAN|NEXT_PUBLIC" .env .env.local .env.example 2>/dev/null; then
    pass "Stellar-related env vars found"
  else
    warn "No Stellar env vars detected in .env files"
  fi
else
  warn "No .env file found — contract address should be in env vars"
fi


# ─────────────────────────────────────────────
#  FINAL SUMMARY
# ─────────────────────────────────────────────

TOTAL=$((PASS + FAIL + WARN))
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════╗${RESET}"
echo -e "${BOLD}║                  AUDIT SUMMARY                  ║${RESET}"
echo -e "${BOLD}╠══════════════════════════════════════════════════╣${RESET}"
echo -e "  ${GREEN}✅ Passed :${RESET} $PASS"
echo -e "  ${RED}❌ Failed :${RESET} $FAIL"
echo -e "  ${YELLOW}⚠️  Warnings:${RESET} $WARN"
echo -e "${BOLD}╚══════════════════════════════════════════════════╝${RESET}"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  🎉 All hard requirements met — looks ready to submit!${RESET}"
elif [ "$FAIL" -le 2 ]; then
  echo -e "${YELLOW}${BOLD}  🔧 Almost there — fix the $FAIL failing item(s) above before submitting.${RESET}"
else
  echo -e "${RED}${BOLD}  🚨 $FAIL requirement(s) failing — significant work needed before submission.${RESET}"
fi

echo ""
echo -e "  ${CYAN}Useful links:${RESET}"
echo -e "  → Stellar Testnet Explorer : https://stellar.expert/explorer/testnet"
echo -e "  → Friendbot (fund wallet)  : https://friendbot.stellar.org"
echo -e "  → StellarWalletsKit docs   : https://github.com/Creit-Tech/Stellar-Wallets-Kit"
echo ""

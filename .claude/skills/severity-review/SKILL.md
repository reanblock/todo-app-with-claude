---
name: severity-review
description: Analyze blockchain/smart contract security audit reports and provide severity reassessment recommendations with focus on financial impact. Use when users request "severity review", "severity assessment", "reassess severities", or similar requests to evaluate whether security findings are appropriately categorized. Specialized for DeFi protocols, smart contracts, and blockchain projects.
---

# Blockchain Security Audit Severity Review

This skill analyzes blockchain and smart contract security audit reports (typically PDFs) and provides expert recommendations on whether finding severities are appropriately assigned, with emphasis on financial impact, exploitability in DeFi contexts, and protocol-specific risks.

## Trigger Conditions

Use this skill when the user requests:
- "severity review"
- "severity assessment"
- "reassess severities"
- "review security findings"
- "audit severity analysis"

AND a security audit report is provided (PDF or other document format).

## Input Requirements

- **Security audit report**: Typically a PDF containing security findings with:
  - Finding identifiers (IDs, references, titles)
  - Current severity ratings (Critical, High, Medium, Low, Informational, etc.)
  - Vulnerability descriptions
  - Impact statements
  - Affected systems/components
  - Exploitation details (if available)

## Processing Workflow

### 1. Extract Report Data

First, read and parse the security audit report:

```bash
# For PDFs, use Python with pypdf or pdfplumber
pip install pypdf --break-system-packages
```

Extract all findings with their:
- Finding ID/identifier
- Title/name
- Current severity rating
- Description
- Impact assessment
- CVSS scores (if present)
- Affected components
- Exploitation complexity
- Business context

### 2. Severity Assessment Framework

Evaluate each finding using blockchain-specific severity criteria with emphasis on financial impact:

**Critical - Immediate Financial Loss or Protocol Compromise**
- **Funds at risk**: Vulnerabilities allowing direct theft/drain of user or protocol funds
- **Reentrancy attacks**: Unprotected external calls enabling fund extraction (e.g., DAO-style attacks)
- **Integer overflow/underflow**: Arithmetic errors leading to unauthorized minting, burning, or transfer of tokens
- **Access control bypass**: Unauthorized access to privileged functions (mint, burn, withdraw, pause, upgrade)
- **Flash loan attacks**: Exploitable price manipulation or logic flaws with flash loan vectors
- **Bridge vulnerabilities**: Cross-chain bridge exploits enabling double-spend or fund theft
- **Oracle manipulation**: Price oracle exploits allowing profitable arbitrage or liquidation manipulation
- **Signature replay**: Transaction replay attacks across chains or within protocol
- **Unchecked external calls**: Delegatecall to untrusted contracts or unchecked low-level calls
- **Upgrade mechanism flaws**: Proxy implementation bugs allowing malicious contract replacement

**High - Potential Financial Loss or Significant Protocol Disruption**
- **Economic exploits**: MEV extraction, sandwich attacks, or front-running with significant value extraction
- **Incorrect accounting**: Balance tracking errors that could lead to insolvency over time
- **Governance attacks**: Vote manipulation, quorum bypasses, or proposal execution exploits
- **Liquidation issues**: Incorrect liquidation logic causing unfair liquidations or preventing necessary ones
- **Slippage manipulation**: AMM/DEX logic flaws allowing excessive slippage exploitation
- **Timestamp dependence**: Block timestamp manipulation affecting time-sensitive financial operations
- **Gas griefing**: Unbounded loops or operations causing DoS through gas exhaustion
- **Centralization risks**: Single points of failure in multi-sig or admin key management
- **Missing input validation**: Unvalidated parameters in financial functions (amounts, addresses, rates)
- **Frontrunning vulnerabilities**: Transaction ordering exploitation in price-sensitive operations

**Medium - Limited Financial Impact or Protocol Degradation**
- **Precision loss**: Rounding errors or precision loss in calculations (limited financial impact)
- **Rate limiting bypass**: Circumventing rate limits or cooldown periods (non-critical functions)
- **Event emission issues**: Missing or incorrect events affecting off-chain integrations
- **Improper error handling**: Functions that fail silently in edge cases
- **Gas optimization issues**: Inefficient operations causing unnecessary costs (no direct exploit)
- **Stale price data**: Oracle staleness checks missing (low-likelihood exploitation)
- **Access control gaps**: Missing role checks on non-critical view/helper functions
- **Insufficient validation**: Missing checks on non-financial parameters
- **Sandwich attack surface**: Theoretical MEV opportunities with low profitability
- **Reentrancy (view functions)**: Read-only reentrancy with limited practical impact

**Low - Minimal Financial Impact or Best Practice Deviations**
- **Code quality**: Unused variables, redundant checks, or non-optimal patterns
- **Natspec/documentation**: Missing or incomplete documentation
- **Style guide violations**: Solidity style inconsistencies (naming, ordering)
- **Test coverage gaps**: Insufficient test coverage (no direct vulnerability)
- **Deprecated functions**: Use of deprecated Solidity features (if functionally safe)
- **Gas micro-optimizations**: Minor gas savings opportunities (<1% improvement)
- **Event parameter indexing**: Non-optimal event parameter indexing
- **Compiler warnings**: Non-critical warnings from compiler
- **Magic numbers**: Hardcoded values that should be constants
- **Minor centralization**: Centralized components with low impact (e.g., parameter updates)

**Informational - No Direct Security Impact**
- **Best practice recommendations**: Solidity best practices without security implications
- **Code organization**: Suggestions for code structure or readability
- **Compliance notes**: Regulatory or standard compliance observations
- **Upgrade path suggestions**: Recommendations for future protocol improvements
- **Monitoring recommendations**: Suggestions for off-chain monitoring or alerting
- **Documentation improvements**: Non-security documentation enhancements

### Blockchain-Specific Severity Modifiers

Apply these modifiers when assessing blockchain findings:

**Financial Exposure Multipliers:**
- **TVL at risk**: High TVL (>$10M) → upgrade by 1 level
- **User funds**: Direct user fund exposure → upgrade by 1 level
- **Protocol insolvency risk**: Could lead to protocol bankruptcy → Critical
- **Irreversible loss**: Funds cannot be recovered → upgrade by 1 level

**Exploitability Factors:**
- **Atomic exploit**: Single-transaction exploit → easier, higher severity
- **Economic viability**: Profit > gas cost by 100x+ → upgrade by 1 level
- **Public mempool**: Exploitable via mempool monitoring → easier, higher severity
- **Requires capital**: Needs significant capital (>$1M) to exploit → downgrade by 1 level
- **Extreme conditions**: Requires unlikely market conditions → downgrade by 1 level

**Deployment Context:**
- **Mainnet with TVL**: Already deployed with locked funds → upgrade by 1 level
- **Testnet only**: Not in production → downgrade by 2 levels
- **Immutable contracts**: Cannot be upgraded/paused → upgrade by 1 level
- **Upgradeable/pausable**: Can be patched quickly → downgrade by 1 level
- **Battle-tested code**: Forked from audited, proven protocols → downgrade by 1 level

### 3. Reassessment Logic

For each finding, evaluate using blockchain-specific criteria:

1. **Financial Impact**: What's the maximum value at risk? (Direct fund theft? Protocol insolvency? Token value manipulation?)
   - Quantify potential loss in USD if possible
   - Consider TVL, user deposits, protocol reserves
   - Assess reversibility (can funds be recovered?)

2. **Exploitability**: How easy is it to exploit in a blockchain context?
   - Single transaction or multi-step attack?
   - Requires flash loans or significant capital?
   - Exploitable via public mempool monitoring?
   - Economic viability (profit vs. gas costs)
   - Frontrunning/MEV opportunities

3. **Scope**: How widespread is the impact?
   - Affects all users vs. specific edge cases?
   - Single pool/vault vs. entire protocol?
   - Mainnet with locked TVL vs. testnet?
   - Cross-chain implications?

4. **Attack Complexity**: What's required to execute?
   - Simple function call vs. complex exploit chain?
   - Requires specific market conditions?
   - Need to manipulate oracles or governance?
   - Timing/block-dependent attacks?

5. **Protocol Context**: What are the deployment specifics?
   - Immutable contracts (cannot be patched)?
   - Upgradeable/pausable (can be fixed quickly)?
   - Currently deployed with TVL?
   - Battle-tested code or novel implementation?

6. **Smart Contract Specifics**: Common vulnerability patterns?
   - Reentrancy (cross-function, cross-contract, read-only)?
   - Access control (missing modifiers, delegatecall risks)?
   - Integer arithmetic (overflow, underflow, precision loss)?
   - Oracle dependence (price manipulation, staleness)?
   - External call safety (unchecked returns, gas griefing)?

Compare the current severity against these criteria and blockchain-specific modifiers, then determine if adjustment is warranted.

### 4. Output Format

Present findings in a terminal table with this exact format:

```
Finding ID | Current Severity | Suggested Severity | Reasoning
-----------|-----------------|-------------------|--------------------------------------------------
[ID]       | [Current]       | [Suggested]       | [Concise 1-2 sentence justification]
```

**Output Requirements**:
- Use ASCII table formatting for terminal display
- Keep reasoning concise but specific (reference key factors like exploitability, impact, scope)
- Only include findings where severity should change (unless user asks for all findings)
- Sort by severity delta (most significant changes first)
- Include a summary at the end with counts

**Example Output**:

```
╔═══════════╦══════════════════╦════════════════════╦════════════════════════════════════════════════════════════════════════╗
║ Finding   ║ Current Severity ║ Suggested Severity ║ Reasoning                                                              ║
╠═══════════╬══════════════════╬════════════════════╬════════════════════════════════════════════════════════════════════════╣
║ FIND-042  ║ High             ║ Critical           ║ Reentrancy in withdraw(); $2.3M TVL at risk, single-tx exploit        ║
║ FIND-015  ║ Critical         ║ High               ║ Flash loan attack requires $5M capital; profit margin <10%             ║
║ FIND-023  ║ Medium           ║ Low                ║ Precision loss affects dust amounts only; max loss <$0.01 per user    ║
║ FIND-007  ║ Low              ║ Medium             ║ Oracle staleness check missing; could enable profitable liquidations  ║
╚═══════════╩══════════════════╩════════════════════╩════════════════════════════════════════════════════════════════════════╝

Summary: 4 findings reassessed (2 upgraded, 2 downgraded) | Total TVL at risk: $2.3M
```

### 5. Presentation Guidelines

After generating the table:

1. **Display directly in terminal** - Use bash echo or Python print to show the formatted table
2. **Provide context** - Brief summary of methodology used
3. **Highlight critical changes** - Call out any upgrades to Critical or downgrades from Critical
4. **Note limitations** - If report lacks detail, mention assumptions made
5. **Offer drill-down** - Ask if user wants detailed analysis on any specific finding

## Edge Cases and Considerations

- **Missing information**: If severity criteria aren't clear from report, state assumptions
- **Vendor scoring differences**: Some vendors use different scales (1-5, P0-P4, etc.) - normalize to standard severity levels
- **CVSS scores**: Use as input but apply contextual business logic; CVSS isn't always accurate for real-world risk
- **Compliance vs. risk**: Distinguish between compliance findings and actual security risks
- **False positives**: Note if findings appear to be false positives (shouldn't just be low severity)
- **Duplicate findings**: Consolidate if same issue reported multiple times

## Technical Implementation Notes

**PDF Parsing**:
```python
# Prefer pdfplumber for better table/structure extraction
import pdfplumber

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        tables = page.extract_tables()
```

**Table Rendering**:
```python
# Use simple string formatting or tabulate library
from tabulate import tabulate

headers = ["Finding ID", "Current Severity", "Suggested Severity", "Reasoning"]
rows = [
    ["FIND-042", "High", "Critical", "Unauthenticated RCE on public endpoint"],
    # ... more rows
]

print(tabulate(rows, headers=headers, tablefmt="grid"))
```

## Quality Checks

Before presenting results:
- ✓ All severity changes have clear justification
- ✓ Justifications reference specific risk factors (exploitability, impact, scope)
- ✓ No finding appears in output without a recommended change (unless user asked for all)
- ✓ Table is properly formatted for terminal display
- ✓ Summary statistics are accurate

## User Interaction

If the report is ambiguous or lacks critical details:
- Ask clarifying questions about business context
- Request additional information about affected systems
- Note assumptions in the reasoning column
- Offer to re-evaluate with additional context

## Success Criteria

A successful severity review:
1. Accurately identifies over-inflated severities (noise reduction)
2. Catches under-rated critical issues (risk identification)
3. Provides actionable, specific reasoning for each change
4. Presents results in clean, scannable terminal format
5. Demonstrates understanding of real-world exploitation vs. theoretical risk

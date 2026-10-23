# Pong 2026 — Defect Log

The single list of bugs in existing behavior. Feature requests belong in [PRD.md](PRD.md). GitHub issues are for feature tasks, not bugs.

## How to use this file

1. Reproduce the problem, check for an existing entry, then use the next available DEF number in both the table and a details entry.
2. Record severity, owner, steps, expected behavior, actual behavior, and the requirement affected. Avoid personal data or secrets.
3. Update the entry in the same PR as a fix. Use **Fixed (PR #)** only once the fix exists; the reviewer then re-tests the merged version and marks it **Verified**.
4. Failed re-testing returns the defect to **Open** with the new evidence.

**Status:** Open → In progress → Fixed (PR #) → Verified.

**Severity:** High = blocks play or loses required state; Medium = incorrect gameplay or controls; Low = cosmetic or cleanup.

## Defects

No defects logged yet. This does not mean the product owner or a teammate has verified the baseline. The first new defect will be **DEF-001**.

| ID | Title | Area | Severity | Status | Owner | Fix in |
| --- | --- | --- | --- | --- | --- | --- |

## Details template

Copy this template for a real reproduced defect; do not mark a planned feature as a bug.

```md
### DEF-NNN: Short description

- Requirement:
- Area / browser / version:
- Severity:
- Status: Open
- Owner:
- Found: YYYY-MM-DD by name
- Steps:
  1. ...
- Expected:
- Actual:
- Fix PR:
- Re-tested version and evidence:
- Verified by / date:
```

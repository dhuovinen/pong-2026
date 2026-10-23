# Pong 2026 — Product Requirements

Version 0.1 · October 23, 2026 · Product owner: Don Huovinen

## Purpose and scope

Build a small, playable browser game, then use it to practice the PawsNet team's requirements, branches, pull requests, reviews, and defect workflow. This repository is independent of PawsNet. Its reference files remain outside this repository.

The owner approved this initial scope in chat on October 23, 2026. Record requirements before implementation, update their status and evidence with the code, and record bugs separately in [DEFECTS.md](DEFECTS.md).

## Roles

| Role | Responsibility |
| --- | --- |
| Product owner — Don | Defines scope and accepts the gameplay |
| Contributor — Don, assisted by Codex | Implements a requirement or fix on a branch, tests it, and opens a PR |
| Teammate reviewer — to be assigned | Tests the preview, reviews the change, and merges; independently verifies fixes |

Codex checks are implementation checks, not independent teammate review. Any role-play will be labeled as simulated.

## Initial requirements

All requirements start **Planned**. **Implemented** means code and implementation checks are complete. **Accepted** requires the product owner's playtest. PR review and defect verification remain separate.

| ID | Requirement and acceptance criteria | Status | Implementation | Evidence |
| --- | --- | --- | --- | --- |
| PONG-1 | Browser game named Pong 2026. Black background; white ball, paddle, top wall and side walls. No bottom wall. | Implemented; acceptance pending | index.html, style.css, src/game.js | Chrome visual check, 2026-10-23 |
| PONG-2 | One player moves a horizontal bottom paddle using the mouse or left/right arrow keys. Paddle stays within side walls. | Implemented; acceptance pending | src/game.js, src/physics.js | Keyboard and mouse browser checks; boundary and pointer tests |
| PONG-3 | Start launches a ball vertically downward from near the top center. Between impacts it follows a straight line at constant speed. | Implemented; acceptance pending | src/physics.js | Initial-trajectory and sustained-speed tests; browser Start check |
| PONG-4 | Top and side walls reflect the ball. A stationary paddle preserves the incoming angle's magnitude and sends the ball upward. Contact position alone does not change the bounce. | Implemented; acceptance pending | src/physics.js | Stationary reflection, wall, off-center, swept contact and contact-time tests |
| PONG-5 | Paddle bounce incorporates its signed average horizontal velocity during the preceding 0.5 seconds. Recent movement still affects contact after the paddle stops. Normalize the result to the same ball speed. | Implemented; acceptance pending | src/physics.js | Window interpolation, direction, expiry, recent stopped movement, normalization and prolonged-rally tests |
| PONG-6 | Each successful paddle hit adds exactly one point. A missed ball ends the game, shows Game Over and the final score, and offers Restart. Restart clears the score and launches a new ball. | Implemented; acceptance pending | src/physics.js, src/game.js | Automated scoring/miss/reset tests; Chrome rally to score 5, miss, Game Over, Restart to score 0 |

## Physics decisions

- Court: 960 × 560 logical units, scaled to the available browser width.
- Ball: radius 8; speed 380 units/second. Paddle: 144 × 12; top at 508; maximum speed 800 units/second.
- Coordinates increase rightward and downward. At paddle contact, start with reflected velocity `(vx, -abs(vy))`, add `0.65 × recentPaddleVelocity` to its horizontal component, then normalize to speed 380.
- Average velocity is signed displacement divided by the full 0.5-second window, with interpolated positions at the window boundary. Time spent stationary counts; movements older than 0.5 seconds have no influence. Opposing movements cancel according to net displacement.
- Limit the influenced outgoing direction to 70° from vertical to avoid nearly horizontal, unplayable returns. A stationary paddle reflects exactly without this limit changing its incoming angle.
- Movement changes direction at impacts only. No gravity, spin curvature, speed increases, or impact-position steering.
- Fixed physics steps and time-of-impact collision handling prevent the ball crossing through a wall or paddle between frames.
- Supporting usability: explicit Start, pause/resume with Space or a button, automatic pause when the page loses focus, and a responsive court. These do not add gameplay modes.

These tuning values are implementation choices within the agreed scope. Changes to the requested behavior require a requirement update.

## Out of scope

Multiplayer, opponents, levels, power-ups, sound, colors, accounts, persistent scores, a database, and changes to PawsNet. Hosting and automatic PR previews have not been requested or configured.

## Change control

After the initial baseline, each feature change gets a requirement ID, a branch from `develop`, and a pull request back into `develop`. Update this table and the change log in that same PR. A teammate tests and reviews before merge. Bugs use DEF IDs and the separate defect log.

## Change log

| Date | Requirement | Change | Commit / PR | Author | Verified by |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23 | PONG-1–6 | Initial agreed scope implemented as the setup baseline, including supporting pause controls | Baseline commit: see Git history | Don with Codex | Codex: syntax checks, 20 automated tests, Chrome gameplay checks. Don's acceptance and independent teammate review pending. |

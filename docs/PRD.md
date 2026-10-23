# Pong 2026 — Product Requirements

Version 0.2 · October 23, 2026 · Product owner: Don Huovinen

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
| PONG-1 | Browser game named Pong 2026. Black background; white ball, paddle, top wall and side walls. No bottom wall. | Accepted — Don, 2026-10-23 | index.html, style.css, src/game.js | Chrome visual check, 2026-10-23; product-owner acceptance below |
| PONG-2 | One player moves a horizontal bottom paddle using the mouse or left/right arrow keys. Paddle stays within side walls. | Accepted — Don, 2026-10-23 | src/game.js, src/physics.js | Keyboard and mouse browser checks; boundary and pointer tests; product-owner acceptance below |
| PONG-3 | Start launches a ball vertically downward from near the top center. Between impacts it follows a straight line at constant speed. | Accepted — Don, 2026-10-23 | src/physics.js | Initial-trajectory and sustained-speed tests; browser Start check; product-owner acceptance below |
| PONG-4 | Top and side walls reflect the ball. A stationary paddle preserves the incoming angle's magnitude and sends the ball upward. Contact position alone does not change the bounce. | Accepted — Don, 2026-10-23 | src/physics.js | Stationary reflection, wall, off-center, swept contact and contact-time tests; product-owner acceptance below |
| PONG-5 | Paddle bounce incorporates its signed average horizontal velocity during the preceding 0.5 seconds. Recent movement still affects contact after the paddle stops. Normalize the result to the same ball speed. | Accepted — Don, 2026-10-23 | src/physics.js | Window interpolation, direction, expiry, recent stopped movement, normalization and prolonged-rally tests; product-owner acceptance below |
| PONG-6 | Each successful paddle hit adds exactly one point. A missed ball ends the game, shows Game Over and the final score, and offers Restart. Restart clears the score and launches a new ball. | Accepted — Don, 2026-10-23 | src/physics.js, src/game.js | Automated scoring/miss/reset tests; Chrome rally to score 5, miss, Game Over, Restart to score 0; product-owner acceptance below |

## Product-owner acceptance

On October 23, 2026, Don Huovinen confirmed in the project chat:

> I have reviewed requirements PONG-1 through PONG-6 and they all look good

This records Don's acceptance of PONG-1 through PONG-6 for baseline commit [`1b67dc7`](https://github.com/dhuovinen/pong-2026/commit/1b67dc7d8cc4bb9bcc82596e51a3a1ec2dfbbd84). Existing automated and browser checks remain the implementation evidence. Product-owner acceptance does not stand in for independent teammate code review or defect verification.

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
| 2026-10-23 | PONG-1–6 | Initial agreed scope implemented as the setup baseline, including supporting pause controls | [1b67dc7](https://github.com/dhuovinen/pong-2026/commit/1b67dc7d8cc4bb9bcc82596e51a3a1ec2dfbbd84) | Don with Codex | Codex: syntax checks, 20 automated tests, Chrome gameplay checks. At baseline, Don's acceptance and independent teammate review were pending. |
| 2026-10-23 | PONG-1–6 | Record product-owner acceptance and update README status | Acceptance PR pending creation | Don; recorded with Codex | Don's confirmation in project chat, quoted above; independent teammate review remains separate. |

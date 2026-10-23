# Pong 2026

One ball. One paddle. Keep it alive.

A black-and-white, single-player browser game. The ball starts at the top and moves downward. Return it with a bottom paddle controlled by your mouse or the arrow keys. Each paddle hit earns a point. Miss the ball and the game ends; Restart starts a fresh rally.

This is Don Huovinen's independent practice project for learning the PawsNet team's workflow. PawsNet itself is not changed. The initial game is a setup baseline; subsequent work follows the branch, PR, teammate review, and defect process below.

- **Repository:** [dhuovinen/pong-2026](https://github.com/dhuovinen/pong-2026), private, under Don's personal account.
- **Status:** Baseline requirements PONG-1 through PONG-6 accepted by Don on October 23, 2026. Independent teammate review remains separate.
- **Local preview:** http://127.0.0.1:2026 while the local server runs.
- **Hosting:** No shared demo, automatic deployment, or automatic PR previews configured yet.
- **Team:** Don (product owner and contributor), Codex (implementation assistance), teammate reviewer to be assigned.

## Start here

| Read | For |
| --- | --- |
| [docs/PRD.md](docs/PRD.md) | Requirements, acceptance criteria, implementation status, physics decisions and change history. Check before proposing a feature. |
| [docs/DEFECTS.md](docs/DEFECTS.md) | The only defect log: reproduction steps, severity, ownership, fix PR and independent verification. |

There is no database in this version, so no database reference or migrations are needed.

## Repository layout

```text
README.md                  project orientation and team workflow
docs/PRD.md                requirements and change history
docs/DEFECTS.md            bugs and verification evidence
index.html                 game screen
style.css                  black-and-white presentation
src/game.js                input, rendering, scoring display and game states
src/physics.js             movement history, ball motion and collision rules
test/physics.test.js       gameplay and physics checks
scripts/serve.mjs          local server, using Node built-ins
.github/pull_request_template.md
```

## Run it

Install Node.js 22 or newer and Git. Clone the private repository using an account that has access. Then, from the repository directory:

```sh
npm run dev
```

Open the Local URL printed by the server: **http://127.0.0.1:2026**. No package installation, build, credentials, or environment file is required to run this version. Stop the server with Ctrl+C.

Run the implementation checks with:

```sh
npm run check
npm test
```

Use the explicit `npm run` form for named scripts so package-manager commands cannot shadow them.

## Play it

1. Select **Start game**, or press Space.
2. Move the paddle with the mouse over the court, or hold the left/right arrow keys.
3. A stationary paddle mirrors the incoming angle. Movement during the last half second influences the outgoing angle, even if you stop just before contact. Ball speed stays constant.
4. Space or **Pause** holds the rally. **Resume game** or Space continues it. Leaving the page or window automatically pauses.
5. Missing the paddle shows **Game Over** and the final score. Select **Restart**, or press Space, for a fresh game with a score of zero.

## How we work

This follows the supplied PawsNet documentation, with `develop` standing in for PawsNet's `buildweek-supabase` integration branch and `PONG-*` standing in for its `BW-*` feature IDs.

1. **Read and scope:** Check the PRD inventory. Before coding, add or update a requirement with a PONG ID, acceptance criteria and owner. A new feature goes in the PRD; incorrect existing behavior goes in the defect log.
2. **Branch:** Start your own branch from up-to-date `develop`, such as `don-pong-7-pause-controls` or `don-def-001-paddle-bounce`. After baseline setup, never commit directly to `main` or `develop`.
3. **Implement and test:** Make one focused feature or fix. Run the relevant checks and perform the associated gameplay test.
4. **Pull request:** Target `develop`, name the requirement or defect in the title, and include the player-visible change, testing evidence, reviewer steps, and preview link when available. Keep documentation changes in the same PR.
5. **Review:** A teammate tests the PR version, requests changes if needed, then merges it. Until hosting exists, the reviewer checks out the PR branch and uses the local run instructions. A self-check or a simulated reviewer is not independent teammate approval.
6. **Update the records:** Record the feature status and change-log evidence in the PRD. For a bug, use **Open → In progress → Fixed (PR #) → Verified**. A teammate re-tests the merged version and records verification separately.
7. **Push at the end of every session.** Save the branch to GitHub even if the work is incomplete; describe unfinished work in the PR.

GitHub issues are for feature tasks, one per PONG item when we begin the workflow exercises. Bugs stay exclusively in `docs/DEFECTS.md`.

The first baseline is committed as project setup before the exercises. That does not count as a completed PR/review cycle, product acceptance, or independently verified defect fix. Both `main` and `develop` will start from this baseline; these are conventions, not configured branch protections. Merging currently does not deploy anything.

## Rules that protect the project

- Never commit passwords, access tokens, private keys or `.env` files.
- Keep real personal data out of defect reports and screenshots.
- No database, payments, accounts or online services are needed for gameplay.
- If database work is introduced later, mirror the team's numbered migration, teammate review and data-protection rules before using it.

## Prior work and AI disclosure

The October 23, 2026 baseline was implemented with Codex. Later exercises should identify exactly what changed from this starting point. Workflow conventions were adapted from the PawsNet reference documents provided locally; those documents are not included in this repository.

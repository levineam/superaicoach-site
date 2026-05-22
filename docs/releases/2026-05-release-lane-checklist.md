# Release Parent: 2026-05 SuperAI Coach Release Lane

Paperclip issue: SUP-1977

## Goal

Install the first release/version management lane for the SuperAI Coach site so preview, release candidate, and production promotion decisions are explicit.

## Version Impact

Minor. This adds release process and checks, not customer-facing UI.

## Included Changes

- `CHANGELOG.md` starts the site changelog.
- `docs/release-management.md` defines the release lane.
- `scripts/release-gate.mjs` provides repeatable preview and production checks.
- `package.json` adds release gate commands.
- `README.md` points contributors to the lane.

## Maturity

Release candidate.

## Preview Gate

- [ ] PR created from `SUP-1977/release-lane`.
- [ ] Vercel preview deployment generated.
- [ ] `npm run release:preview` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.

## Production Gate

- [ ] Reviewer approves release lane.
- [ ] Maturity moved to `public-stable`.
- [ ] Production promotion command run with `--release-parent SUP-1977 --maturity public-stable`.
- [ ] Production deploy completes from `main`.
- [ ] `https://superaicoach.com` loads after deploy.

## Rollback

Revert the release-lane PR if the docs or gate script block urgent site work unexpectedly. The rollback affects release process only and does not alter customer data.


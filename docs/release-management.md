# SuperAI Coach Release Management

This site uses a lightweight release lane so public production changes are intentional, verified, and reversible enough for a marketing and customer-facing product.

## Release Surfaces

- `production`: `main` deployed to `https://superaicoach.com`.
- `preview`: Vercel preview deployments from pull requests and feature branches.
- `local`: private experiments, prototypes, and local-only work that must not be promoted directly to production.

## Maturity States

Every meaningful product/content change should be labeled with one maturity state in its release parent or PR:

- `draft`: local-only or branch-only work. May be incomplete and should not be exposed to users.
- `internal-preview`: safe for Andrew/team review on a Vercel preview URL. Not production-ready.
- `release-candidate`: feature/content complete, changelog entry present, verification checklist passing.
- `public-stable`: approved for production after preview checks and public-facing verification.

Private experiments stay in `draft` until they have a release parent, preview URL, changelog entry, and explicit promotion decision.

## Version Impact

Use semver language even though this is a site, not a library:

- `patch`: copy edits, small visual fixes, bug fixes, analytics fixes, or low-risk internal polish.
- `minor`: new pages, meaningful landing-page sections, campaign launches, new customer-visible flows, or new integrations behind existing concepts.
- `major`: navigation model changes, positioning changes, customer account model changes, irreversible data-flow changes, or anything that changes the product promise.

Routine work can stay issue-scoped when it is a patch and does not alter public product messaging or customer flows. Minor and major changes need a release parent.

## Release Parent Requirements

Create a Paperclip release parent, or a clearly linked equivalent issue, for:

- New public pages or campaigns.
- Homepage, pricing, or positioning changes.
- Customer Mission Control changes.
- Authentication, account, analytics, or data-collection changes.
- Any bundled group of related fixes that should ship together.

The release parent should record:

- Goal and intended audience.
- Version impact: patch, minor, or major.
- Included PRs/issues.
- Current maturity state.
- Preview URL.
- Verification checklist results.
- Production promotion owner and timestamp.
- Rollback note: revert PR, disable route, or remove promoted content.

## Preview Gate

Before a PR is considered ready for production promotion:

1. Branch is based on current `origin/main`.
2. `npm run lint` passes.
3. `npm run test` passes.
4. `npm run build` passes.
5. Vercel preview deployment exists and matches the intended route scope.
6. `CHANGELOG.md` has an `Unreleased` entry for meaningful public/user-visible changes.
7. The release parent or PR states the current maturity as `internal-preview` or `release-candidate`.

Run the local gate:

```bash
npm run release:preview
```

## Production Gate

Production promotion requires everything in the preview gate plus:

1. Maturity is `public-stable`.
2. Release parent is named.
3. Preview URL has been reviewed for the changed routes.
4. Production verification command is known before promotion.
5. The rollback path is written in the release parent or PR.

Run the local production gate:

```bash
npm run release:production -- --release-parent SUP-XXXX --maturity public-stable
```

After production deploy, verify the changed public routes directly. For Mission Control changes, run the local smoke script against the target deployment when credentials are available:

```bash
MISSION_CONTROL_SMOKE_BASE_URL=https://superaicoach.com npm run mission-control:smoke
```

## Vercel Settings

- Project: `superaicoach-site`.
- Root Directory: repository root for this standalone repo. If deployed from a monorepo wrapper, the root directory must point at `superaicoach-site`.
- Pull requests should create public Vercel preview deployments.
- Production deployment should come from `main` after the production gate passes.
- If Vercel build settings allow a custom build command, use:

```bash
npm run release:preview && npm run build
```

Use the production gate as a manual pre-promotion command unless the deployment environment can safely pass a real release parent and maturity value.


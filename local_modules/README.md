# Local Modules

This folder contains legacy dependencies that have been "vendored" (committed directly to source control).

In 2026, the GitHub fork references used by this project became unavailable (michaelstockton/isomorphic-relay-router). Those fork URLs were pinned in dependency metadata and lock data, which caused yarn install failures in CI/CD.

Because this codebase is still built on legacy layers (React 16, Relay Classic, React Router v3), replacing these libraries was not practical in normal maintenance windows. To stabilize builds, the package sources were placed here and local file dependencies are used from the project root package.json.

## Packages Included:

- `isomorphic-relay` (v0.7.4)
- `isomorphic-relay-router` (v0.8.6)

## How to use/maintain:

- **DO NOT DELETE THIS FOLDER.** If deleted, `yarn install` will fail.
- These are mapped via the `package.json` at the project root using the `file:` protocol:
  ```json
  "isomorphic-relay": "file:./local_modules/isomorphic-relay",
  "isomorphic-relay-router": "file:./local_modules/isomorphic-relay-router"
  ```
- If you modify the contents of these folders, you must run `yarn install` at the project root to update the symlinks/cache.

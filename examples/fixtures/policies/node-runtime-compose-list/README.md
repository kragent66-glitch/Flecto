# node-runtime-compose-list fixture

This fixture proves the node-runtime pack catches both **list** and **map** forms of Compose `environment`.

| Service | Environment shape | Changes | Expected finding |
|---|---|---|---|
| `api` | `["NODE_ENV=production"]` (list) | adds `NODE_OPTIONS=--inspect=0.0.0.0:9229`, `NODE_TLS_REJECT_UNAUTHORIZED=0`, `NODE_DEBUG=http` | `node-runtime-tls-verification-disabled` (error), `node-runtime-debug-enabled` (warn), `node-runtime-inspector-enabled` (warn) |
| `worker` | `{ NODE_ENV: "production" }` (map) | adds `NODE_OPTIONS: --inspect=0.0.0.0:9229`, `NODE_TLS_REJECT_UNAUTHORIZED: "0"`, `NODE_DEBUG: http` | same 3 ids/severities, but paths use dot notation (`services.worker.environment.NODE_OPTIONS`) |

The differ emits per-key leaf events for both shapes:
- list form: `path = services.api.environment["NODE_OPTIONS"]`, `after = NODE_OPTIONS=--inspect=0.0.0.0:9229`
- map form: `path = services.worker.environment.NODE_OPTIONS`, `after = --inspect=0.0.0.0:9229`

Run it with:

```sh
node ../../../index.js policies test .
```

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

import { testPolicyFixture } from '../src/policy-test.js';

/**
 * Findings as a comparable set. `testPolicyFixture` already asserts the fixture's
 * own `expected` list, so these assertions exist to pin the cases a reviewer
 * would look for by name -- and to keep them from being silently weakened by an
 * edit to the fixture JSON alone.
 * @param {{ findings: Array<{ id: string, severity: string, path: string }> }} result
 * @returns {string[]}
 */
function summarize(result) {
  return result.findings.map(({ id, severity, path }) => `${severity} ${id} ${path}`).sort();
}

test('list and map forms of environment both trigger node-runtime rules', async () => {
  const result = await testPolicyFixture(
    resolve('examples/fixtures/policies/node-runtime-compose-list'),
  );

  assert.equal(result.findings.length, 6);
  assert.deepEqual(summarize(result), [
    'error node-runtime-tls-verification-disabled services.api.environment["NODE_TLS_REJECT_UNAUTHORIZED"]',
    'error node-runtime-tls-verification-disabled services.worker.environment.NODE_TLS_REJECT_UNAUTHORIZED',
    'warn node-runtime-debug-enabled services.api.environment["NODE_DEBUG"]',
    'warn node-runtime-debug-enabled services.worker.environment.NODE_DEBUG',
    'warn node-runtime-inspector-enabled services.api.environment["NODE_OPTIONS"]',
    'warn node-runtime-inspector-enabled services.worker.environment.NODE_OPTIONS',
  ]);
});

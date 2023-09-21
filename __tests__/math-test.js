const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(['+', 1, 5]), 6);
    assert.strictEqual(eva.eval(['+', 3, ['+', 2, 5]]), 10);
    assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
    assert.strictEqual(eva.eval(['-', 1, 5]), -4);
    assert.strictEqual(eva.eval(['-', 3, ['-', 2, 5]]), 6);
    assert.strictEqual(eva.eval(['-', ['-', 3, 2], 5]), -4);

    assert.strictEqual(eva.eval(['*', 1, 5]), 5);
    assert.strictEqual(eva.eval(['*', 3, ['*', 2, 5]]), 30);
    assert.strictEqual(eva.eval(['*', ['*', 3, 2], 5]), 30);

    assert.strictEqual(eva.eval(['/', 10, 5]), 2);
    assert.strictEqual(eva.eval(['/', 6, ['/', 10, 5]]), 3);
    assert.strictEqual(eva.eval(['/', ['/', 6, 2], 3]), 1);

    assert.strictEqual(eva.eval(['/', 6, ['-', 10, 8]]), 3);
    assert.strictEqual(eva.eval(['*', ['-', 6, 2], 3]), 12);
};
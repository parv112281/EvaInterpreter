const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
    assert.strictEqual(eva.eval('x'), 10);
    assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
    assert.strictEqual(eva.eval('y'), 100);
    assert.strictEqual(eva.eval('VERSION'), '0.1');
    assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);
    assert.strictEqual(eva.eval(['var', 'z', ['+', 1, 2]]), 3);
    assert.strictEqual(eva.eval('z'), 3);
};
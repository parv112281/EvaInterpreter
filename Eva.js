const assert = require('assert');

const Environment = require('./Environment');

class Eva {

    constructor(golbal = new Environment()) {
        this.global = golbal;
    }

    eval(exp, env = this.global) {
        // Self-evaluating expressions
        if (isNumber(exp)) {
            return exp;
        }
        if(isString(exp)) {
            return exp.slice(1, -1);
        }
        if (exp[0] === '+') {
            let res = this.eval(exp[1]) + this.eval(exp[2]);
            return res;
        }

        // Math operations
        if (exp[0] === '*') {
            let res = this.eval(exp[1]) * this.eval(exp[2]);
            return res;
        }

        if (exp[0] === '/') {
            let res = this.eval(exp[1]) / this.eval(exp[2]);
            return res;
        }

        if (exp[0] === '-') {
            let res = this.eval(exp[1]) - this.eval(exp[2]);
            return res;
        }

        // Variable declarations
        if (exp[0] === 'var') {
            const[_, name, value] = exp;
            return env.define(name, this.eval(value));
        }
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }


        throw `Unimplemented: ${JSON.stringify(exp)}`;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp.startsWith('"') && exp.endsWith('"');
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

// -------------------
// Tests:

const eva = new Eva(new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',
}));
// Self-evaluating expressions
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');

// Simple math combinations
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

// variables
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);
assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
assert.strictEqual(eva.eval('y'), 100);
assert.strictEqual(eva.eval('VERSION'), '0.1');
assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);
assert.strictEqual(eva.eval(['var', 'z', ['+', 1, 2]]), 3);
assert.strictEqual(eva.eval('z'), 3);


console.log('All assertions passed.');


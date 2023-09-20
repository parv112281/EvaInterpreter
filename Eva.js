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
            let res = this.eval(exp[1], env) + this.eval(exp[2], env);
            return res;
        }

        // Math operations
        if (exp[0] === '*') {
            let res = this.eval(exp[1], env) * this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '/') {
            let res = this.eval(exp[1], env) / this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '-') {
            let res = this.eval(exp[1], env) - this.eval(exp[2], env);
            return res;
        }

        // Variable declarations
        if (exp[0] === 'var') {
            const[_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }

        // Block expressions
        if (exp[0] === 'begin') {
            const blockEnv = new Environment({}, env);
            return this._evalBlock(exp, blockEnv);
        }

        // assignments
        if (exp[0] === 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));
        }


        throw `Unimplemented: ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, env) {
        const [_tag, ...expressions] = block;
        let result;
        expressions.forEach((exp) => {
            result = this.eval(exp, env);
        });
        return result;
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

// blocks
assert.strictEqual(eva.eval(['begin', 
    ['var', 'x', 10],
    ['var', 'y', 20],
    ['+', ['*', 'x', 'y'], 30]
]), 230);
assert.strictEqual(eva.eval(
    ['begin', 
        ['var', 'x', 10],
        ['begin',
            ['var', 'x', 20],
            'x'
        ],
        'x'
    ]
), 10);
assert.strictEqual(eva.eval(
    ['begin', 
        ['var', 'y', 10],
        ['begin',
            ['var', 'x', 20],
            ['+', 'x', 'y']
        ],
        'x'
    ]
), 10);
assert.strictEqual(eva.eval(
    ['begin', 
        ['var', 'y', 10],
        ['var', 'result',['begin',
            ['var', 'x', ['+', 'y', 10]],
            'x'
        ]],
        'result'
    ]
), 20);

// assignments
assert.strictEqual(eva.eval(
    ['begin', 
        ['var', 'y', 10],
        ['begin',
            ['set', 'y', 100]
        ],
        'y'
    ]
), 100);


console.log('All assertions passed.');


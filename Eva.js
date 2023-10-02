const assert = require('assert');

const Environment = require('./Environment');
const { type } = require('os');

class Eva {

    constructor(golbal = GlobalEnvironment) {
        this.global = golbal;
    }

    eval(exp, env = this.global) {
        // Self-evaluating expressions
        if (this._isNumber(exp)) {
            return exp;
        }
        if(this._isString(exp)) {
            return exp.slice(1, -1);
        }

        // Variable declarations
        if (exp[0] === 'var') {
            const[_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }
        if (this._isVariableName(exp)) {
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

        // if expression
        if (exp[0] === 'if') {
            const [_tag, condition, consequent, alternate] = exp;
            if (this.eval(condition, env)) {
                return this.eval(consequent, env);
            } 
            return this.eval(alternate, env);
        }

        // while expression
        if (exp[0] === 'while') {
            const [_tag, condition, body] = exp;
            let res = null;
            while (this.eval(condition, env)) {
                res = this.eval(body, env);
            }
            return res;
        }

        // function declarations
        if (exp[0] === 'def') {
            const [_tag, name, params, body] = exp;
            const fn = {
                params,
                body,
                env
            };
            return env.define(name, fn);
        }

        // function calls
        if (Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp.slice(1).map((arg) => this.eval(arg, env));
            // native functions
            if (typeof fn === 'function') {
                return fn(...args);
            }
            // user-defined functions
            const activationRecord = {};
            fn.params.forEach((param, index) => {
                activationRecord[param] = args[index];
            });
            const activationEnv = new Environment(activationRecord, fn.env);
            return this._evalBody(fn.body, activationEnv);
        }

        throw `Unimplemented: ${JSON.stringify(exp)}`;
    }

    _evalBody(body, env) {
        if (body[0] === 'begin') {
            return this._evalBlock(body, env);
        }
        return this.eval(body, env);
    }

    _evalBlock(block, env) {
        const [_tag, ...expressions] = block;
        let result;
        expressions.forEach((exp) => {
            result = this.eval(exp, env);
        });
        return result;
    }

    _isNumber(exp) {
        return typeof exp === 'number';
    }
    
    _isString(exp) {
        return typeof exp === 'string' && exp.startsWith('"') && exp.endsWith('"');
    }
    
    _isVariableName(exp) {
        return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp);
    }    
}

// Default Golbal Environment
const GlobalEnvironment = new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',

    // Math functions
    '+': (a, b) => a + b,
    '-': (a, b = null) => b ? a - b : -a,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,

    // Comparison functions
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
    '=': (a, b) => a === b,

    // print function
    print(...args) {
        console.log(...args);
    },
});


module.exports = Eva;
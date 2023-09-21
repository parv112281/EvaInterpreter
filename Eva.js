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

        // Comparison operations

        if (exp[0] === '>') {
            let res = this.eval(exp[1], env) > this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '<') {
            let res = this.eval(exp[1], env) < this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '>=') {
            let res = this.eval(exp[1], env) >= this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '<=') {
            let res = this.eval(exp[1], env) <= this.eval(exp[2], env);
            return res;
        }

        if (exp[0] === '=') {
            let res = this.eval(exp[1], env) === this.eval(exp[2], env);
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

module.exports = Eva;
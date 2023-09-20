class Environment {
    constructor(record = {}) {
        this.name = 'Environment';
        this.record = record;

    }
    define(name, value) {
        this.record[name] = value;
        return value;
    }
    lookup(name) {
        if (this.record.hasOwnProperty(name)) {
            return this.record[name];
        }
        throw new ReferenceError(`Variable ${name} is not defined`);
    }
}

module.exports = Environment;
class Environment {
    constructor(record = {}, parent = null) {
        this.name = 'Environment';
        this.record = record;
        this.parent = parent;
    }
    define(name, value) {
        this.record[name] = value;
        return value;
    }
    assign(name, value) {
        this.resolve(name).record[name] = value;
        return value;
    }
    lookup(name) {
        return this.resolve(name).record[name];
    }
    resolve(name) {
        if (this.record.hasOwnProperty(name)) {
            return this;
        } else if (this.parent) {
            return this.parent.resolve(name);
        }
        throw new ReferenceError(`Variable ${name} is not defined`);
    }
}

module.exports = Environment;
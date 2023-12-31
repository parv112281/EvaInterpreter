const Eva = require('../Eva');
const Environment = require('../Environment');

const tests = [
    require('./self-eval-test'),
    require('./math-test'),
    require('./block-test'),
    require('./assignment-test'),
    require('./variables-test'),
    require('./if-test'),
    require('./while-test'),
    require('./built-in-function-test'),
    require('./user-defined-function-test'),
    require('./lambda-function-test'),
]

const eva = new Eva();

tests.forEach(test => test(eva));
eva.eval(['print', '"Hello"', '"World!"']);
console.log('All assertions passed.');
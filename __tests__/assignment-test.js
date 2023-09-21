const assert = require('assert');

module.exports = eva => {
    assert.strictEqual(eva.eval(
        ['begin', 
            ['var', 'y', 10],
            ['begin',
                ['set', 'y', 100]
            ],
            'y'
        ]
    ), 100);
};
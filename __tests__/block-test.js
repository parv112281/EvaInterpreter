const assert = require('assert');

module.exports = eva => {
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
            'y'
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
};
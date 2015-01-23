require('mocha-testcheck').install();
var assert = require('assert');
var now    = require('../src/now');

function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
}

describe('now', function () {

    describe('_nextTickInterval', function () {

        check.it('returns a number',
                [ gen.strictPosInt, gen.int ],
                function (x, y) {
                    assert(isNumber(now._nextTickInterval(x, y)));
                });
        
    });
    

    describe('_nextTwist', function () {

        check.it('returns an integer',
                [gen.int],
                function (x) {
                    assert(Number.isInteger(now._nextTwist(x)));
                });

        check.it('returns positive',
                [gen.int],
                function (x) {
                    var res = now._nextTwist(x);
                    assert(Math.abs(res) === res);
                });

        check.it('is 32 bits long',
                [gen.resized(1000, gen.strictPosInt)],
                function (x) {
                    assert(32 === now._nextTwist(x).toString(2).length);
                });

        it('should return predictable results when given a seed',
                function () {
                    var start_end = [
                        1406331136,
                        3152967168
                    ];

                    var end = now._nextTwist(start_end[0]);

                    assert(end === start_end[1]);

                });
    });

    describe('_getLowBitsOf', function () {

        check.it('returns an integer',
                [ gen.posInt, gen.posInt ],
                function (x, n) {

                    assert(Number.isInteger(now._getLowBitsOf(x, n)));
                    
                });

        check.it('always has a result lower or equal to input',
                { times: 1000 },
                [ gen.posInt, gen.posInt ],
                function (x, n) {

                    assert(x >= now._getLowBitsOf(x, n));
                    
                });

        it('should produce the low bits of a number', function () {

            var testCases = [
                [2, 1],
                [8, 4],
                [82, 4],
                [23, 3],
                [83999, 9]
            ];

            var expectedResults = [
                0,
                8,
                2,
                7,
                31
            ];

            testCases.forEach(function (test, i) {

                var res = now._getLowBitsOf(test[0], test[1]);

                assert(res === expectedResults[i]);

            });
        });
        
    });
});

var EventEmitter = require('events').EventEmitter;

/**
 * emit a `tick` event roughly every *x* minutes based on a stochastic
 * process.
 */

const mersenneTwisterConstant = 1812433253;
const seed                    = 1406331136;

// get *n* low bits of *x*
function getLowBitsOf(x, n) {
    var b = x.toString(2);
    return parseInt(b.slice(-n), 2);
}

// get next number in mersenne twister
function nextTwist(last) {
    return Math.abs(
            getLowBitsOf(
                (last ^ (last >> 30)) *
                mersenneTwisterConstant,
                32
                )
            );
}

module.exports = {
    _getLowBitsOf: getLowBitsOf,
    _nextTwist: nextTwist
};

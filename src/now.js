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

function nextTickInterval (last, avgDelay) {
    return Math.log(nextTwist(last)) * avgDelay;
}

function nextTick (last, avgDelay) {
    return last + nextTickInterval(last, avgDelay);
}

function* nextTickForNow(tick, avgDelay, lastTick) {
    'use strict';

    let n = getNow();

    if (isAfter(n, tick)) {
        if (lastTick) {
            yield lastTick;
        } else {
            yield tick;
        }
    } else {
        yield* nextTickForNow(nextTick(tick, avgDelay), avgDelay, tick);
    }
}

function* cycleTicks (seed, delay) {
    yield* nextTickForNow(seed, delay);
    yield* cycleTicks(t, delay);
}

function getNow () {
    return Date.now() / 1000;
}

function isAfter(goal, current) {
    return current >= goal;
    
}

function Now () {

    this._getLowBitsOf     = getLowBitsOf;
    this._nextTwist        = nextTwist;
    this._nextTickInterval = nextTickInterval;
    this._nextTick         = nextTick;
    
}

Now.prototype = new EventEmitter();

Now.prototype._tick = function (ticks) {

    'use strict';

    let t     = ticks.next().value;
    let n     = getNow();
    let _this = this;

    console.log(t, n);

    let doTick = function (tick) {

        let gap = tick - _this.lastTick;

        _this.lastTick = tick;
        _this.emitTick(t, gap);
        _this._tick(ticks);
    };

    if (isAfter(t, n)) {
        doTick(t);
    } else {

        setInterval(function () {

            let n = getNow();

            if (isAfter(t, n)) {
                doTick(t);
            }

        }, 1000);

    }
};

Now.prototype.emitTick = function (tick, gap) {
    this.emit('tick', tick, gap);
};

Now.prototype.go = function (delay, customSeed) {
    'use strict';

    this.lastTick = customSeed || seed;

    let ticks = cycleTicks(this.lastTick, delay);

    this._tick(ticks);

};

Now.prototype._debugLog = function () {
    console.log(this.lastTick);
};


module.exports = new Now();

var settings = require('./config/settings');
var now      = require('./src/now');
var statsD   = settings.debug ? require('node-statsd') : null;
/*
var knex     = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: './now.db'
    }
});
*/

var sDClient;

if (statsD) {
    sDClient = new statsD({
        host: settings.statsd.host || 'localhost',
        prefix: 'now.debug.'
    });
}

/*
knex.schema.hasTable('ticks').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('ticks', function (t) {
            t.increments('id');
            t.timestamp('tick');
            t.text('tags');
        });
    }
}).done();
*/

now.on('error', function (err) {
    sendStat('increment', 'event.error');
    console.warn(err);
});

now.on('tick', function (time, gap) {
    if (_isDebug(settings)) {
        now._debugLog();
    }

    sendStat('timing', 'event.tick.gap_between', gap);
    sendStat('histogram', 'event.tick.gap_distribution', gap);
});

now.go(settings.delay);

function _isDebug(settings) {
    return settings.hasOwnProperty('debug') && settings.debug;
}

function sendStat(type) {
    var args = Array.prototype.slice.apply(arguments);
    if (_isDebug(settings)) {
        sDClient[type].apply(this, args.slice(1));
    }
}


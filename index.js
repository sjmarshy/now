var settings = require('./config/settings');
var now      = require('./src/now');
var knex     = require('knex')({
    dialect: 'sqlite3',
    connection: {
        filename: './now.db'
    }
});

knex.schema.hasTable('ticks').then(function (exists) {
    if (!exists) {
        return knex.schema.createTable('ticks', function (t) {
            t.increments('id');
            t.timestamp('tick');
            t.text('tags');
        });
    }
}).done();

now.on('error', function (err) {
    console.warn(err);
});

if (_isDebug(settings)) {
    now.on('tick', function (time) {
        now._debugLog();
    });
}

function _isDebug(settings) {
    return settings.hasOwnProperty('debug') && settings.debug;
}

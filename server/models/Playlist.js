/*
 * server/models/Playlist.js
 */

'use strict';

var ultimate = require('ultimate');

var mongoose = ultimate.lib.mongoose,
    plugin = ultimate.db.mongoose.plugin;

var app = require('../app');

// Schema
var schema = new mongoose.Schema({
    'collaborative': Boolean,
    'external_urls': {
        'spotify': String
    },
    'href': String,
    'id': String,
    'images': [{
        'height': Number,
        'url': String,
        'width': Number
    }],
    'name': String,
    'owner': {
        'external_urls': {
            'spotify': String
        },
        'href': String,
        'id': String,
        'type': String,
        'uri': String
    },
    'public': Boolean,
    'snapshot_id': String,
    'tracks': {
        'href': String,
        'total': Number
    },
    'type': String,
    'uri': String
});

// Restify
schema.restify = {
    'list': {
        'admin': '*',
        'user': ['name.first']
    },
    'get': {
        'admin': '*',
        'user': ['name.first']
    },
    'post': {
        'admin': '*'
    },
    'put': {
        'admin': '*'
    },
    'delete': {
        'admin': '*'
    }
};

schema.statics.findOrCreatePlaylist = function (playlist, cb) {
    console.log(playlist);
    app.models.Playlist.findOneAndUpdate({
        id: playlist.id
    }, playlist, function (err, pl) {
        if (err) {
            return cb(err);
        }
        if (pl) {
            // Updated existing.
            return cb(null, pl);
        } else {
            app.models.Playlist.create(playlist, cb);
        }
    });
};


// Plugins
schema.plugin(plugin.findOrCreate);
schema.plugin(plugin.timestamp);

// Indexes
schema.path('id').index({unique: true});

// Model
var model = mongoose.model('Playlist', schema);


// Public API
exports = module.exports = model;

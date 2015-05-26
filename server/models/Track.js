/*
 * server/models/Track.js
 */

'use strict';

var ultimate = require('ultimate');

var mongoose = ultimate.lib.mongoose,
  plugin = ultimate.db.mongoose.plugin;

var app = require('../app');

// Schema

var schema;
/* jshint ignore:start */
schema = new mongoose.Schema({
  album: {
    album_type: String,
    available_markets: [String],
    external_urls: {
      spotify: String
    },
    href: String,
    id: String,
    images: [{
      height: Number,
      url: String,
      width: Number
    }],
    name: String,
    type: String,
    uri: String
  },
  artists: [{
    external_urls: {
      spotify: String
    },
    href: String,
    id: String,
    name: String,
    type: String,
    uri: String
  }],
  available_markets: [String],
  disc_number: Number,
  duration_ms: Number,
  explicit: Boolean,
  external_ids: {
    isrc: String
  },
  external_urls: {
    spotify: String
  },
  href: String,
  id: String,
  name: String,
  popularity: Number,
  preview_url: String,
  track_number: Number,
  type: String,
  uri: String
});
/* jshint ignore:end */
// Restify
schema.restify = {
  'list': {
    'admin': '*'
  },
  'get': {
    'admin': '*'
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

schema.statics.findOrCreateTrack = function (Track, cb) {
  console.log(Track);
  app.models.Track.findOneAndUpdate({
    id: Track.id
  }, Track, function (err, tr) {
    if (err) {
      return cb(err);
    }
    if (tr) {
      // Updated existing.
      return cb(null, tr);
    } else {
      app.models.Track.create(Track, cb);
    }
  });
};


// Plugins
schema.plugin(plugin.findOrCreate);
schema.plugin(plugin.timestamp);

// Indexes
schema.path('id').index({unique: true});

// Model
var model = mongoose.model('Track', schema);


// Public API
exports = module.exports = model;

/*
 * server/models/User.js
 */

'use strict';

var _ = require('lodash'),
    ultimate = require('ultimate');

var mongoose = ultimate.lib.mongoose,
    plugin = ultimate.db.mongoose.plugin,
    type = ultimate.db.mongoose.type;

var app = require('../app');

// Schema
var schema = new mongoose.Schema({
  email: { type: type.Email, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String }
  },
  accessToken: { type: String },
  auth: {
    spotify: {
      id : { type: String},
      token: { type: String},
      profile: { type: type.Mixed}
    }
  },
  roles: [{ type: String }]
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

// Indexes
schema.path('email').index({ unique: true });
schema.path('accessToken').index({ unique: true });
schema.path('auth.spotify.id').index({unique: true, sparse: true});

// Virtuals
schema.virtual('safeJSON').get(function () {
  return JSON.stringify(this.getSafeJSON());
});
// Plugins
schema.plugin(plugin.findOrCreate);
schema.plugin(plugin.timestamp);

// Promote user to admin if admin does not yet exist.
schema.pre('save', function (next) {
  var user = this,
      model = exports;
  model.count({ roles: 'admin' }, function (err, count) {
    if (err) { return next(err); }
    if (count === 0) {
      user.roles.push('admin');
    }
    next();
  });
});

// Safe JSON (internal data removed)
schema.methods.getSafeJSON = function () {
  var user = this.toJSON();

  user.id = user._id;
  delete user._id;
  delete user.__v;
  delete user.accessToken;

  if (user.auth.spotify) {
    delete user.auth.spotify.token;
  }

  return user;
};

schema.statics.findOrCreateSpotify = function (accessToken, refreshToken, profile, cb) {
  console.log(profile._json);
  var data = {
    email: profile._json.email,
    name: {
      /* jshint camelcase: false */
      first: profile._json.display_name,
      last: ''
      /* jshint camelcase: true */
    },
    'auth.spotify': {
      id: profile.id,
      token: accessToken,
      profile: profile._json
    }
  };
  app.models.User.findOneAndUpdate({
    email: data.email
  }, _.omit(data, ['email', 'name']), function (err, user) {
    if (err) { return cb(err); }
    if (user) {
      // Updated existing account.
      return cb(null, user);
    } else {
      // Create new account.
      app.models.User.create(data, cb);
    }
  });
};

// Model
var model = mongoose.model('User', schema);

// Public API
exports = module.exports = model;

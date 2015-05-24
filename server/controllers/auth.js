/*
 * server/controllers/auth.js
 */

'use strict';

var querystring = require('querystring');

var ultimate = require('ultimate');

var passport = ultimate.lib.passport;

function spotify(req, res, next) {
  req.session.ultimate.query = req.query;
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'user-read-private',
      'playlist-read-private',
      'playlist-modify-private',
      'playlist-modify-public',
      'user-library-read'
    ]
  })(req, res, next);
}




function spotifyCallback(req, res, next) {
  var qs = querystring.stringify(req.session.ultimate.query);
  delete req.session.ultimate.query;
  passport.authenticate('spotify', {
    successRedirect: '/login' + (qs ? '?' + qs : ''),
    failureRedirect: '/login' + (qs ? '?' + qs : ''),
    failureFlash: true
  })(req, res, next);
}


// Public API
exports.spotify = spotify;
exports.spotifyCallback = spotifyCallback;

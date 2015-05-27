/*
 * server/routes.js
 */

'use strict';

// var ultimate = require('ultimate');

// Register controllers to routes.
exports.register = function (app, restify) {
  var c = app.controllers,
      s = app.servers.express.getServer(),
      error404 = app.lib.controller.error404;

  // var ensureAdmin = ultimate.server.controller.ensureAdmin,
  //     ensureGuest = ultimate.server.controller.ensureGuest,
  //     ensureUser = ultimate.server.controller.ensureUser,
  //     csrf = ultimate.server.controller.csrf;

  // API
  restify.any('/api/loadPlaylists', c.api.spotify.populatePlaylists, ['list']);
  restify.any('/api/loadSavedTracks', c.api.spotify.populateSavedTracks, ['list']);
  restify.any('/api/lonelyTracks', c.api.spotify.getSavedTracksNotInPlaylist, ['list']);
  restify.any('/api/savedTracks', c.api.spotify.getSavedTracks, ['list']);
  restify.any('/api/logout', c.api.auth.logout, ['post']);

  s.get(/^\/api(?:[\/#?].*)?$/, error404);

  // Home
  s.get('/', c.home.index);
  s.get('/express', c.home.express);
  s.get('/page', c.home.page);
  s.get('/task', c.home.task);

  // Auth
  s.get('/auth/spotify', c.auth.spotify);
  s.get('/auth/spotify/callback', c.auth.spotifyCallback);
  // Status
  s.get('/status', c.status.index);
  s.get('/status/health', c.status.health);

  // Catch all
  s.get('*', app.lib.controller.catchAll);


};

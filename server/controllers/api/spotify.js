/*
 * server/controllers/api/spotify.js
 */

'use strict';


var app = require('../../app');
var spotify = app.services.spotifyApi;

function playlistsLIST(req) {
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  spotify.getUserPlaylists(req.user._doc.auth.spotify.id)
    .then(function(data) {
      console.log('Retrieved playlists', data.body);
    },function(err) {
      console.log('Something went wrong!', err);
    });
}


// Public API
exports.playlists = {LIST: playlistsLIST};

'use strict';
module.exports = exports = function(app){
  var SpotifyWebApi = require('spotify-web-api-node');
  var spotifyApi = new SpotifyWebApi({
    clientId : app.config.api.spotify.key,
    clientSecret : app.config.api.spotify.secret,
    redirectUri :  app.config.api.spotify.redirectUri
  });

  return spotifyApi;

};

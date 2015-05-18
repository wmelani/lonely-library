'use strict';
module.exports = exports = function(passport){
  var _ = require('lodash'),
    passportSpotify = require('passport-spotify');
  var _app = null;


  /**
   * Attach Spotify strategy.
   *
   * @private
   * @param {object} spotifyConfig Spotify config object.
   * @param {string} baseUrl Base URL.
   * @return {undefined}
   */
  function _attachStrategy(spotifyConfig, baseUrl) {
    if (!_.isString(spotifyConfig.appId)) {
      throw new Error('Missing string in config: api.spotify.appId');
    }

    if (!_.isString(spotifyConfig.appSecret)) {
      throw new Error('Missing string in config: api.spotify.appSecret');
    }

    passport.use(new passportSpotify.Strategy({
        clientID: spotifyConfig.appId,
        clientSecret: spotifyConfig.appSecret,
        callbackURL: baseUrl + '/auth/spotify/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        _app.models.User.findOrCreateSpotify(accessToken, refreshToken, profile, function (err, user) {
          return done(null, user);
        });
      }));
  }

  /**
   * Attach passport middleware.
   *
   * @param {App} app Application.
   * @return {undefined}
   */
  function attach(app) {
    _app = app;

    if (!_.isObject(app.config) ||
      !_.isObject(app.config.api) ||
      !_.isObject(app.config.api.spotify)) {
      throw new Error('Missing string in config: api.spotify');
    }
    _attachStrategy(_app.config.api.spotify, _app.config.url);
  }

// Public API
  exports.attach = attach;
  return exports;
};




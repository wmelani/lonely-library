/*
 * client/js/spotify/index.js
 */

'use strict';

var angular = require('angular'),
  rhtml = require('rhtml');

var ngModule = angular.module('app.spotify', []);

// Controllers
require('./controllers/playlists')(ngModule);

// Routes
ngModule.config(function ($stateProvider) {
  $stateProvider
    .state('app.spotify', {
      url: '/spotify',
      views: {
        '@': {
          controller: 'PlaylistsCtrl',
          template: rhtml('./templates/playlists.html')
        }
      },
      resolve: {
        playlists: ['Restangular', function (Restangular) {
          return Restangular.all('playlists').getList();
        }]
      }
    });
});

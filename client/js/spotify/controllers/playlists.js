/*
 * client/js/main/controllers/home.js
 */

'use strict';

exports = module.exports = function (ngModule) {
  ngModule.controller('PlaylistsCtrl', function ($scope, playlists) {
    $scope.playlists = playlists;

  });
};

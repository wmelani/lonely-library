/*
 * client/js/auth/services/auth.js
 */

'use strict';

//var querystring = require('querystring');

//var _ = require('lodash'),
  //$ = require('jquery');

var _o;


function playlists() {
  return _o.Restangular.all('spotify').getList();
}

// Public API
exports = module.exports = function (ngModule) {
  ngModule.provider('spotify', function () {

    this.$get = ['$rootScope', '$state', '$stateParams', 'Restangular', 'util', function ($rootScope, $state, $stateParams, Restangular, util) {
      _o = {
        $rootScope: $rootScope,
        $state: $state,
        $stateParams: $stateParams,
        Restangular: Restangular,
        util: util
      };

      return {
        playlists: playlists
      };
    }];
  });
};

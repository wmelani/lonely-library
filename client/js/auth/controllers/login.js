/*
 * client/js/auth/controllers/login.js
 */

'use strict';

var _ = require('lodash');

var _o;

exports = module.exports = function (ngModule) {
  ngModule.controller('LoginCtrl', function ($scope, alert, auth, layout) {
    _o = {
      $scope: $scope,
      alert: alert,
      auth: auth,
      layout: layout
    };

    _.assign($scope, {
      focus: {
        username: true
      },
      formData: {},
      loginSpotify : auth.loginSpotify,
      showError: false
    });
  });
};

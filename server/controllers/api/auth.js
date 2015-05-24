/*
 * server/controllers/api/auth.js
 */

'use strict';

function logoutPOST(req, cb) {
  // Log out.
  req.logout();
  return cb(null, {
    success: true
  });
}

function meLIST(req, cb) {
  return cb(null, req.user ? req.user.getSafeJSON() : null);
}

// Public API
exports.logout = { POST: logoutPOST };
exports.me = { LIST: meLIST };

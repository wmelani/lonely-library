/*
 * server/controllers/api/spotify.js
 */

'use strict';


var app = require('../../app');
var spotify = app.services.spotifyApi;
var spotifyPageUtils = app.services.spotifyPageUtils;

function populatePlaylistsLIST(req,cb) {
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  var options = {
    limit : 50,
    offset : 0
  };
  spotifyPageUtils.doPromiseLoop(
    handlePlaylist,
    options,
    spotify.getUserPlaylists,
    [req.user._doc.auth.spotify.id,options]).then(function(){
      cb(null,{done : true});
    });

}

function populateSavedTracksLIST(req,cb) {
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  var options = {
    limit : 50,
    offset : 0
  };
  spotifyPageUtils.doPromiseLoop(
    handleSavedTrack,
    options,
    spotify.getMySavedTracks,
    [options]).then(function(){
      cb(null,{done : true});
    });
}

function getPlaylistTracks(id,playlistId){
  var options = {
    limit : 100,
    offset : 0
  };
  spotifyPageUtils.doPromiseLoop(
    handleTrack,
    options,
    spotify.getPlaylistTracks,
    [id,playlistId,options]).then(function(){});
}

function getSavedTracksLIST(req,cb){
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  app.models.Track.findSavedTracks(function(data){
    cb(null,data);
  });
}

function getSavedTracksNotInPlaylistLIST(req,cb){
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  app.models.Track.findSavedTracksNotInPlaylist(function(data){
   cb(null,data);
  });
}

function doNothing(){}
function handleTrack(args,item){
    app.models.Track.findOrCreateTrack(item.track,doNothing);
}
function handleSavedTrack(args,item){
  app.models.Track.findOrCreateTrackAsSaved(item.track,doNothing);
}
function handlePlaylist(args, item){
  getPlaylistTracks(args[0],item.id);
  app.models.Playlist.findOrCreatePlaylist(item,doNothing);
}




// Public API
exports.populatePlaylists = {LIST: populatePlaylistsLIST};
exports.populateSavedTracks = {LIST: populateSavedTracksLIST};
exports.getSavedTracks = {LIST: getSavedTracksLIST};
exports.getSavedTracksNotInPlaylist = {LIST: getSavedTracksNotInPlaylistLIST};

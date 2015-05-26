/*
 * server/controllers/api/spotify.js
 */

'use strict';


var app = require('../../app');
var spotify = app.services.spotifyApi;
var Promise = require('mpromise');

function playlistsLIST(req) {
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  var options = {
    limit : 50,
    offset : 0
  };
  doPromiseLoop(
    handlePlaylist,
    options,
    spotify.getUserPlaylists,
    [req.user._doc.auth.spotify.id,options]).then(function(){});
}

function getPlaylistTracks(id,playlistId){
  var options = {
    limit : 100,
    offset : 0
  };
  doPromiseLoop(
    handleTrack,
    options,
    spotify.getPlaylistTracks,
    [id,playlistId,options]).then(function(){});
}

function doNothing(){}
function handleTrack(args,item){
    app.models.Track.findOrCreateTrack(item.track,doNothing);
}
function handlePlaylist(args, item){
  getPlaylistTracks(args[0],item.id);
  app.models.Playlist.findOrCreatePlaylist(item,doNothing);
}

var doPromiseLoop = function(perItem,options, func, args){
  var promise = new Promise();
  promise.onResolve(function (){
  });

  var iterateResults = function(data){
    for(var i = 0; i < data.body.items.length; i++){
      var item = data.body.items[i];
      perItem(args,item);
    }
  };

  var onFinished = function(){};

  var download = function(dontCare,data){

    iterateResults(data);

    var arr = [];
    for (var i = 0; i < args.length; i++)
    {
      arr.push(args[i]);
    }
    arr.push(download);
    options.offset += data.body.items.length;
    if (options.offset < data.body.total){

      func.apply(spotify,arr);
    }
    else {
      onFinished();
    }
  };
  var arr = [];
  for (var i = 0; i < args.length; i++)
  {
    arr.push(args[i]);
  }
  arr.push(download);
  func.apply(spotify,arr);
  return promise;

};


// Public API
exports.playlists = {LIST: playlistsLIST};

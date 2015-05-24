/*
 * server/controllers/api/spotify.js
 */

'use strict';


var app = require('../../app');
var spotify = app.services.spotifyApi;

function playlistsLIST(req) {
  spotify.setAccessToken(req.user._doc.auth.spotify.token);
  pageToEnd(req.user._doc.auth.spotify.id);
}

function pageToEnd(id){
  var options = {
    limit : 50,
    offset : 0
  };

  var onFinished = function(){
    debugger;
  };

  var downloadPlaylists = function(data){

    for(var i = 0; i < data.body.items.length; i++){
      var item = data.body.items[i];
      app.models.Playlist.findOrCreatePlaylist(item,function(){});
    }
    options.offset += data.body.items.length;
    if (options.offset < data.body.total){
      spotify.getUserPlaylists(id,options).then(downloadPlaylists);
    }
    else{
      onFinished();
    }
  };
  spotify.getUserPlaylists(id,options).then(downloadPlaylists);
}


// Public API
exports.playlists = {LIST: playlistsLIST};

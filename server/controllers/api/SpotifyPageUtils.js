'use strict';
var app = require('../../app');
var spotify = app.services.spotifyApi;
var Promise = require('mpromise');

exports = module.exports = function(){
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
  return doPromiseLoop;
};


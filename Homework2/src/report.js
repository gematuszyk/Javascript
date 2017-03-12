const fs = require('fs');
const bev = require('./basketfunc.js');
const request = require('request');

function doCall(gidUrl, callback) {
  if(gidUrl === undefined) {
    return;
  } else {
    request(gidUrl, function(err, res, body) {
      const data = JSON.parse(body);
      gidName = data.g.nextgid;
      gidUrl = 'http://foureyes.github.io/csci-ua.0480-spring2017-008/homework/02/' + gidName + '_gamedetail.json';
      const str = bev.processGameData(data);
      console.log(str);
      //console.log(gidUrl);
      return callback(gidUrl);
    });
  }
}

var gidUrl = 'http://foureyes.github.io/csci-ua.0480-spring2017-008/homework/02/0021600680_gamedetail.json';

doCall(gidUrl, function(response){
    // Here you have access to your variable
    console.log(response);
});

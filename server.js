// ============
// Server stuff -- Almost certainly unnecessary now
// ============
var fs = require('fs');
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io") (server);
var port = 8080;

var data = JSON.parse(fs.readFileSync('src/assets/resources/map.json', 'utf8'));
var credits = JSON.parse(fs.readFileSync('src/assets/resources/credits.json', 'utf8'));

app.use(express.static(__dirname + "/build"));
app.get('/rooms/:slug', function(req, res){
  // Get the x and y co-ordinates and return the right room info
  for (var i = 0; i < data.rooms.length; i++){        

    if(data.rooms[i].slug== req.params.slug){
      res.json(data.rooms[i]);
      return;
    } else {
      console.log('nothing to see here');
    }
  }
});

app.get('/credits', function(req, res){
  res.json(credits);
});

server.listen(port, function(){
	console.log("Server listening at port %d", port);
});
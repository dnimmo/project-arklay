// ============
// Server stuff
// ============
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var compression = require('compression');
// Serve on port 8080 in dev but port 80 in live! Make this programatic at some point because it's annoying now. :P
var port = 80;

// Load the map and credits
var data = JSON.parse(fs.readFileSync('src/assets/resources/map.json', 'utf8'));
var credits = JSON.parse(fs.readFileSync('src/assets/resources/credits.json', 'utf8'));

//  GZIP assets
app.use(compression());

// Serve files
app.use(express.static(__dirname + "/build"));
app.get('/rooms/:slug', function(req, res){
  // Get the slug of the room we're moving to
  for (var i = 0; i < data.rooms.length; i++){        
    // Return the correct room
    if(data.rooms[i].slug== req.params.slug){
      res.json(data.rooms[i]);
      return;
    }
  }
});

// Serve the credits
app.get('/credits', function(req, res){
  res.json(credits);
});

server.listen(port, function(){
	console.log("Server listening at port %d", port);
});

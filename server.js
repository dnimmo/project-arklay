// ============
// Server stuff
// ============
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var compression = require('compression');
var port = process.env.PORT || 80;

// Load the map and credits
var data = JSON.parse(fs.readFileSync('src/assets/resources/map.json', 'utf8'));
var credits = JSON.parse(fs.readFileSync('src/assets/resources/credits.json', 'utf8'));

//  GZIP assets
app.use(compression());

// Serve files
app.use(express.static(__dirname + "/build"));
app.get('/rooms/:slug', function(req, res){
  // Get the slug of the room we're moving to
  for (var i = 0; i < data.rooms.length; i+=1){        
    // Return the correct room  
    if(data.rooms[i].slug == req.params.slug){
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

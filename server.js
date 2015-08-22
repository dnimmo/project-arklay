// ============
// Server stuff
// ============
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var compression = require('compression');
// Serve on port 8080 in dev but port 80 in live! Make this programatic at some point because it's annoying now. :P
var port = 8080;

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

// ============
// Socket stuff
// ============

// Functionality to tell players when another player is in the same room as them. Plan is potentially to multiplex socket connections so I can restrict how many players can interact with each other at one time (preferably just two, is what I'm currently thinking)

// Array of users: user will contain an ID (which is the socket.id) and a location
var users = [];
// Force the array not to contain any user info to begin with; This will be increased per connection and decreased per disconnection, in order to only store one location per user
users.length = 0;

io.on('connection', function(socket){
	console.log('New connection');
  var user = {};
  
  socket.on('setup', function(data){
    // Register this user in users[]
    user.id = socket.id;
    user.location = data || '';
    users.push(user);
  });
  
  // Check to see if anyone else is in the same room as this player
	socket.on('checkForOtherPeople', function(newRoom, oldRoom){
    // Get the current player's location
    user.location = newRoom || '';

    for(var i = 0; i < users.length; i++){
      // If anyone else is in this room
      if(newRoom == users[i].location && users[i].id != socket.id){
        // Send message to the this player, and the other player(s) in the room
        var message = '== You sense a strange presence =='
        socket.emit('someoneElseIsHere', message);
        io.sockets.connected[users[i].id].emit('someoneElseIsHere', message);
      }
    }
    // Check through all of the other users to see if any of them are in this room
    console.log('Users ', users);
	});
  
  socket.on('disconnect', function(){
    // Delete this user from the users array
    var disconnectedUser = {};
    disconnectedUser.id = socket.id
    var userToBeDeleted = users.indexOf(socket.id);
    users.splice(userToBeDeleted, 1);
  })
});
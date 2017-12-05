const express = require('express');
app  = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient

var db
var collection

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static('views'));

//connect to db
MongoClient.connect('mongodb://stickybandit:hackapp17@ds127126.mlab.com:27126/sticky-wars', (err, database) => {
  if (err) return console.log(err)
    else {
     db = database
     console.log("MongoDB connected!")
   }
 });

//landing page
app.get('/', function(req, res){
  res.render('sample.ejs');
});

//create session for group
app.get('/createSession', function(req, res) {
  res.render('createSession.ejs');
});

//main UI
app.get('/:id', function(req, res) {
  res.render('stickyBoard.ejs');
});

//socket interaction
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  collection = db.collection('sessions');

  //create session in DB
  socket.on('create-session-message', function(msg){
    console.log('Received sesison message: ' + msg);
    collection.insertOne({session: msg});
  });

  socket.on('join', function(room) {
    console.log("room call: " + room);
    socket.join(room);

    var name = 'session';
    var query = {};
    query[name] = room;
    collection.find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);

      //not what it looks like...
      io.in(room).emit('sticky load', result);
    });
  });

  //receive message type and broadcast to all users
  //will need to refactor to only broadcast to users in
  //given session -- refactored
  socket.on('dev', function(msg){
    var sessionID = msg.split(':')[0];
    var stickyText = msg.split(':')[1];

    console.log("SessionID is: " + sessionID);
    console.log('Received dev message: ' + stickyText);

    socket.join(sessionID);

    collection.update(
      { session: sessionID }, 
      {
        $push: {
          dev: stickyText
        }
      });

    console.log('emitting dev:' + stickyText);
    io.in(sessionID).emit('dev broadcast', stickyText);
  });

  socket.on('auto', function(msg){
    var sessionID = msg.split(':')[0];
    var stickyText = msg.split(':')[1];

    console.log("SessionID is :" + sessionID);
    console.log('Received auto message: ' + stickyText);

    socket.join(sessionID);

    collection.update(
      { session: sessionID }, 
      {
        $push: {
          auto: stickyText
        }
      });

    console.log('emitting auto:' + stickyText);
    io.in(sessionID).emit('auto broadcast', stickyText);
  });

  socket.on('qa', function(msg){
    var sessionID = msg.split(':')[0];
    var stickyText = msg.split(':')[1];

    console.log("SessionID is :" + sessionID);
    console.log('Received qa message: ' + stickyText);

    socket.join(sessionID);

    collection.update(
      { session: sessionID }, 
      {
        $push: {
          qa: stickyText
        }
      });

    console.log('emitting qa:' + stickyText);
    io.in(sessionID).emit('qa broadcast', stickyText);
  });
});

//handle 404s etc.
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//start server
http.listen(3000, function(){
  console.log('listening on *:3000');
});

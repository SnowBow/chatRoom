#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('chatApp:server');
var http = require('http');
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
var server = http.createServer(app);
var connection = require('../public/js/dbconnection');
var io = require('socket.io')(server);
var moment = require('moment');
io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('message', function(msg){
        var now = moment().format('YYYY-MM-DD HH:mm');
        console.log('message: ' + msg.name + ' says: ' + msg.text);
        connection.query('INSERT INTO message SET ?', {
            time: now, name: msg.name, text: msg.text, timeDesc: msg.timeDesc}, function(err, result) {
          if (err) throw err;
          console.log(result.insertId);
        });
        io.emit('newMessage', msg);

    }).on('disconnect', function(){
        console.log('user disconnected');
    });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

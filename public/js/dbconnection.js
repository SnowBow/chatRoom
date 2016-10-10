var mysql      = require('mysql');
// var connection = mysql.createConnection({
//     host     : '127.0.0.1',
//     user     : 'root',
//     password : 'password',
//     database : 'chatApp',
//     port: 3306
// });
var connection = mysql.createConnection(process.env.DATABASE_URL || 'mysql://b0412e5d99ce59:0c71bf65@us-cdbr-iron-east-04.cleardb.net/heroku_b0301d76f332155?reconnect=true');


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('db connected as id ' + connection.threadId);
});

module.exports = connection;
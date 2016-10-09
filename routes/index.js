var express = require('express');
var router = express.Router();

var con = require('../public/js/dbconnection.js');


router.get('/', function(req, res, next) {
    res.render('index', {title: 'JasonWu \'s chatRoom'});
});

router.get('/messages', function(req, res, next) {
    con.query('SELECT * FROM message',function(err,rows){
        if(err) throw err;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(rows);
    });

});

router.post('/login', function(req, res, next) {
    con.query('SELECT * FROM user WHERE name = "' + req.body.username +'"',function(err,rows){
        if(err) throw err;
        if(rows[0]) {
            if(rows[0].password === req.body.password) {
                res.sendStatus(200);
            }else {
                res.sendStatus(401);//wrong password
            }
        }else {
            res.sendStatus(400);//not existed
        }
    });
});

router.post('/signin', function(req, res, next) {
    con.query('SELECT * FROM user WHERE name = "' + req.body.username +'"',function(err,rows){
        if(err) throw err;
        if(rows[0]) {
            res.sendStatus(400);//already used name
        }else {
            con.query('INSERT INTO user SET ?', {
                name: req.body.username, password: req.body.password}, function(err, result) {
                if (err) throw err;
                console.log(result.insertId);
                res.sendStatus(200);
            });

        }
    });
});

router.post('/chat', function(req, res, next) {
    res.render('chat', { name: req.body.username });
});

module.exports = router;

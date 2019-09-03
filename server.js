var express = require('express')
var mysql = require('mysql')
var session = require('express-session')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()

var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'nodelogin'
})

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.sendfile(path.join(__dirname+'/login.html'))
})

app.post('/auth',(req,res)=>{
    var username = req.body.username
    var password = req.body.password
    if(username && password)
    {
        conn.query('select * from accounts where username = ? and password = ?',[username,password],(err,result,fields)=>{
            if(result.length > 0)
            {
                req.session.loggedin = true
                req.session.username = username
                res.redirect('/home');
            }else{
                res.send('incorrect username or password')
            }
            res.end();
        })
    }else{
        res.send('please enter username and password')
        res.end()
    }
})

app.get('/home' ,(req,res)=>{
    if(req.session.loggedin)
    {
        res.send('Welcom back, '+ req.session.username + '!')
    }else{
        res.send('please login to view this page')
    }
    res.end()
})

app.listen(3000)
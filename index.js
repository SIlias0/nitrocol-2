const mysql = require('mysql');
const express = require("express");
const session = require('express-session');

const connexion = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'nitrocol_2'
})

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized : true
}));

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(request, response) {
    response.render("login")
});

app.get('/produits', function(request, response) {
    response.render("produits")
});

app.get('/espace_perso', function(request, response) {
    response.render("espace-personnel")
});

app.post('/auth' ,function(request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if(username && password) {
        connexion.query('SELECT * FROM users WHERE username = ? AND password = ?' , [username , password] , function(error, results, fields){
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/produits')
            } else {
                response.send('usernmae ou mdp ERREUR ')
            }
            response.end();
        })
    } else {
        response.send('enter user et mdp');
        response.end();
    }
}); 

app.listen(8080);
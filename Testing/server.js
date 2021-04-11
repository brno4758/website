var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var session = require('express-session');
const { v1: uuidv1 } = require('uuid');
// app.use(session({
// 	genid: function(req){
// 		return uuidv1()
// 	},
// 	saveUninitialized: false,
// 	secret: 'secret',
// 	resave: false
// }));
uuidv1();


//Create Database Connection
var pgp = require('pg-promise')();

//Database Connection information
//Local need to run 'node server.js'
// const dbConfig = {
//     host: 'localhost',
//     port: 5433,
//     database: 'postgres',
//     user: 'postgres',
//     password: 'csci3308'
// };

const PORT = process.env.PORT || 2222;
const dbConfig = process.env.DATABASE_URL;
pgp.pg.defaults.ssl = {rejectUnauthorized: false};


var db = pgp(dbConfig);



//set the view engine to ejs
app.set('view engine', 'ejs');
//Use relative paths
app.use(express.static(__dirname + '/'));

/******Get and Post Requests******/


//Render Login
app.get('/', function(req, res) {

if(req.session.name===undefined){
	res.render('pages/login',{
		local_css:"",
		my_title:"Home Page",
		error: false,
		success: false,
		message: ''
	});
}
else{
	res.render('pages/home');
}
});

//Login post requests(username and password)

app.post('/login/login' , function(req, res) {
	var username = req.body.userName;
	var password = req.body.password;
	var verify = `select * from user_table where username='${username}' and password='${password}';`
	console.log(verify);
	db.any(verify)
	.then(function(data) {
		console.log(data.length);
		if(data.length == 0)
		{
			res.render('pages/login', {
				my_title: "Login Page",
				error: true,
				success: false,
				message: "Login failed"
			})
		}
		else
		{
			req.session.name = username;
			res.render('pages/home', {
				my_title: "Home Page",
				error: false,
				success: true,
				message: "Login successful"
			})
		}
	})
	.catch(function(err) {
		res.render('pages/login', {
			my_title: "Login Page",
			error: true,
			success: false,
			message: "Login failed"
		})
	})
});

app.post('/login/add_user', function(req, res) {
	var new_user = req.body.userName;
	var pass = req.body.password;
	var insert_user = `Insert Into user_table (username, password) Values('${new_user}', '${pass}');`;
	console.log(insert_user);
	db.any(insert_user)
		.then(function(data) {
			res.render('pages/login', {
				my_title: "Login Page",
				error: false,
				success: true,
				message: 'Registration Successful, Please Login'
			})
		})
		.catch(function(err) {
			console.log(err);
			res.render('pages/login', {
				my_title: "Login Page",
				error: true,
				success: false,
				message: 'Username is taken, please try again.'
			})
		})
});

//Render Home
app.get('/home', function(req,res) {
	if(req.session.name != undefined){
		res.render('pages/home', {
			my_title: "Home Page",
			message: ''
		})
	}
	else
	{
		res.render('pages/login', {
			my_title: "Login Page",
			error: false,
			success: false,
			message: ''
		})
	}
});

//Render How to Play
app.get('/howto', function(req, res) {
	if(req.session.name != undefined){
		res.render('pages/howto', {
			my_title: "How To Play Page"
		})
	}
	else
	{
		res.render('pages/login', {
			my_title: "Login Page",
			error: false,
			success: false,
			message: ''
		})
	}
});

//Render Levels
app.get('/level', function(req, res) {
	if(req.session.name != undefined)
	{
		res.render('pages/level', {
			my_title: "Levels Page"
		});
	}
	else
	{
		res.render('pages/login', {
			my_title: "Login Page",
			error: false,
			success: false,
			message: ''
		});
	}
});

//Render Leaderboard
app.get('/leaderboard', function(req, res) {
	if(req.session.name != undefined)
	{
		var load_personal = `Select * From scores_table Where username='${req.session.name}' Order By scores ASC limit 5;`;
		db.task('get-everything', task => {
			return task.batch([
				task.any(load_personal)
			]);
		})
		.then(info => {
			res.render('pages/leaderboard', {
				my_title: "Leaderboard Page",
				player: info[0],
				username: req.session.name,
				error: false,
				message: ''
				
			})
		})
		.catch(err => {
			console.log(err);
			res.render('pages/leaderboard', {
				my_title: "Leaderboard Page",
				player: '',
				username: req.session.name,
				error: true,
				message: "Invalid Score Input"
			})
		})
	}
	else
	{
		res.render('pages/login', {
			my_title: "Login Page",
			error: false,
			success: false,
			message: ''
		})
	}
});



//Leaderboard (Send top 5 scores to table)

app.post('/leaderboard/add_score', function(req, res) {
	var score = req.body.score_input;
	var update_score = `Insert Into scores_table(username, scores) Values('${req.session.name}', ${score});`;
	var load_scores = `Select * From scores_table Where username='${req.session.name}' Order By scores ASC limit 5;`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(update_score),
			task.any(load_scores)
		]);
	})
	.then(info => {
		console.log(info);
		res.render('pages/leaderboard',{
			my_title: "Leaderboard Page",
			player: info[1],
			username:req.session.name,
			error: false,
			message: "Time Added"
		})
	})
	.catch(err => {
		//console.log(err);
		res.render('pages/leaderboard', {
			my_title: "Leaderboard Page",
			player: '',
			username:req.session.name,
			error: true,
			message: "Invalid Score Input"
		})
	});
});


//Render Game 
app.get('/game', function(req, res) {
	if(req.session.name != undefined)
	{
		res.render('pages/game', {
			my_title: "Game Page"
		})
	}
	else
	{
		res.render('pages/login', {
			my_title: "Login Page",
			error: false,
			success: false,
			message: ""
		})
	}
});



app.listen(PORT);
console.log('2222 is a magic port');

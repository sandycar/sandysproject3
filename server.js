var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');


var PORT = 3001;
var app = express();

// set the app up with bodyparser
app.use(bodyParser());

// Database configuration
var databaseUrl = 'mongodb://localhost:27017/foodtrucks_db';
var collections = ["foodtrucks"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
    console.log("Database Error:", error);
});

//this loads the .env file in
//we need this for secret information that we don't want on our github
require('dotenv').config()

/*
  if we don't do this here then we'll get this error in apps that use this api

  Fetch API cannot load No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

  read up on CORs here: https://www.maxcdn.com/one/visual-glossary/cors/
*/
//allow the api to be accessed by other apps
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

// app.get('/', function(req, res) {
//     res.send('Hello world');
// });

//curl -d "username=fred&password=unodostresgreenbaypackers" -X POST http://localhost:3001/login
/*
	this will return

	{"message":"successfuly authenticated","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YmM1OTZjOGUxOTZmYmIwZTdkNWI0MGYiLCJ1c2VybmFtZSI6ImZyZWQiLCJpYXQiOjE1Mzk2NzU4OTIsImV4cCI6MTUzOTY5MDI5Mn0.xalv4I9rSmKf9LV6QaeJboV4NvY0F7wIltDMc-o_amQ"}
*/
app.get("/", function(req, res) {
 console.log(req)   
    // Insert the song into the songs collection
    db.foodtrucks.insert({name: "senor sisig", cuisine: "filipino", phone: "8081231234", payment:"cash", days:"M-F"}, function(error, foodtrucks) {
      // Log any errors
      if (error) {
        console.log(error);
      }else {
        
        res.json(foodtrucks);
      }
    });
  });

app.listen(PORT, function() {
    console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});
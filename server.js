var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');
var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3001;
var app = express();
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
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

/*
/foodtruckinfo/0
/foodtruckinfo/1
*/

app.get("/foodtruckinfo", function (req, res) {
  console.log('hello route')
  var $;
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.foodtrucksin.com/city/san-francisco_ca?page=1").then(function (response) {
    // Load the html body from axios into cheerio
    $ = cheerio.load(response.data);
    // };
    // For each element with a "title" class
    $(".truck_details").each(function (i, element) {
      // var text = $(this).find('h2').children().attr('href')
      // console.log($(element).children().children().eq(0).html()); //title
      // console.log($(element).children().eq(1).html()); //city
      // console.log($(element).children().eq(3).html()); //food type
      var title = $(element).children().children().eq(0).html();
      var city = $(element).children().eq(1).html();
      var foodType = $(element).children().eq(3).html();
      console.log('title: ', title) //title: Lobster Truck
      console.log('city: ', city) // city: San Francisco, CA
      console.log('foodType: ', foodType) //foodType: Seafood 
      // If this found element had both a title and a link
      if (title && city && foodType) {
        //   // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          city: city,
          food_type: foodType
        },
          function (err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
      }
    });
  });
//Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});
          // $(this).children().children().eq(0).find('a').attr('src')
        // Save the text and href of each link enclosed in the current element
        // console.log($(element).html())
        // res.json( $(i).html())
  //     });
  //   });
  // });

app.get("/", function(req, res) {
//  console.log(req)   
    // Insert the song into the songs collection
    db.foodtrucks.insert(
      {name: "senor sisig", cuisine: "filipino", phone: "8081231234", payment:"cash", days:"M-F"}, function(error, foodtrucks){
      // Log any errors
      if (error) {
        console.log(error);
      }else {
        res.send(foodtrucks);
      }
    });
  });

app.listen(PORT, function() {
    console.log('🌎 ==> Now listening on PORT %s! Visit http://localhost:%s in your browser!', PORT, PORT);
});
require("dotenv").config();

// var request = require("request");
var Spotify = require("node-spotify-api");
var axios = require("axios");
const fs = require("fs");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

////////////////////////////////////////////////////////////////////////////////////////

function Movie_Info(movie) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  axios
    .get(queryUrl)
    .then(function(response) {
      console.log("Title: " + response.data.Title);
      console.log("Release Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);

      // Some movies do not have rotten tomatoes
      var found = false;
      for (let i = 0; i < response.data.Ratings.length; i++) {
        if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
          console.log("Rotten Tomatoes: " + response.data.Ratings[i].Value);
          found = true;
        }
      }
      if (!found) {
        console.log("Rotten Tomatoes: N/A");
      }
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    })
    .catch(function(error) {
      if (error.response) {
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////

var command = process.argv[2];
switch (command) {
  case "concert-this":
    var artist = process.argv[3];
    /////////////////////////////

    break;
  case "spotify-this-song":
    var song = process.argv[3];
    /////////////////////////////

    break;
  case "movie-this":
    var movie = "";

    if (process.argv[3] === undefined) {
      var movie = "Mr. Nobody.";
    } else {
      for (var i = 3; i < process.argv.length; i++) {
        if (i === process.argv.length - 1) {
          movie += process.argv[i].trim();
        } else {
          movie += process.argv[i].trim() + "+";
        }
      }
    }

    Movie_Info(movie);

    break;
  case "do-what-it-says":
    //////////////////////

    break;

  default:
    console.log("Enter a command to do");
    break;
}

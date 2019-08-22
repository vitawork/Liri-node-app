require("dotenv").config();

// var request = require("request");
var Spotify = require("node-spotify-api");
var axios = require("axios");
const moment = require("moment");
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
      if (response.data["Response"] === "False") {
        console.log("Movie not found!");
      } else {
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
      }
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
function Artist_Info(artist) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  axios
    .get(queryUrl)
    .then(function(response) {
      var w = "";
      for (let i = 1; i < 17; i++) {
        w += response.data[i];
      }
      var d = response.datetime;
      if (w === "{warn=Not found}") {
        console.log("It was not found, please try a different name");
      } else {
        if (response.data.length === 0) {
          console.log("No upcoming events.");
        } else {
          for (var obj in response.data) {
            console.log("Venue:");
            console.log("");
            console.log(response.data[obj].venue.name);
            var location = response.data[obj].venue.city;
            if (response.data[obj].venue.region !== "") {
              location += ", " + response.data[obj].venue.region;
            }
            console.log(location + ", " + response.data[obj].venue.country);
            console.log(
              moment(response.data[obj].datetime, "YYYY-MM-DDTh:mm:ss").format(
                "L"
              )
            );

            console.log("_____________________________________________");
          }
        }
      }
    })
    .catch(function(error) {
      if (error.response) {
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function Name() {
  var name = "";

  if (process.argv[3] !== undefined) {
    for (var i = 3; i < process.argv.length; i++) {
      if (i === process.argv.length - 1) {
        name += process.argv[i].trim();
      } else {
        name += process.argv[i].trim() + "+";
      }
    }
  }

  return name;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

var command = process.argv[2];
switch (command) {
  case "concert-this":
    var artist = "";
    if (process.argv[3] === undefined) {
      console.log("Please enter a Band or an Artist");
    } else {
      artist = Name();
      Artist_Info(artist);
    }

    break;
  case "spotify-this-song":
    var song = process.argv[3];
    ///////////////////

    break;
  case "movie-this":
    var movie = "";

    if (process.argv[3] === undefined) {
      movie = "Mr. Nobody.";
    } else {
      movie = Name();
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

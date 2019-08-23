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
        var c = `________________________________________________________________________________
      
Title: ${response.data.Title}
Release Year: ${response.data.Year}
IMDB Rating: ${response.data.imdbRating}`;

        var found = false;
        for (let i = 0; i < response.data.Ratings.length; i++) {
          if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
            c += `\nRotten Tomatoes: ${response.data.Ratings[i].Value}`;
            found = true;
          }
        }
        if (!found) {
          c += `\nRotten Tomatoes: N/A`;
        }

        c += `\nCountry: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}
________________________________________________________________________________\n`;

        console.log(c);

        fs.appendFile(
          "log.txt",
          `${command}  "${movie.split("+").join(" ")}"\n${c}`,
          function(err) {
            if (err) {
              return console.log(err);
            }
          }
        );
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
          var c = `_____________________________________________\n`;

          for (var obj in response.data) {
            c += `\nVenue:  ${response.data[obj].venue.name}
        ${response.data[obj].venue.city}`;

            if (response.data[obj].venue.region !== "") {
              c += `, ${response.data[obj].venue.region}`;
            }
            c += `, ${response.data[obj].venue.country}
        ${moment(response.data[obj].datetime, "YYYY-MM-DDTh:mm:ss").format("L")}
_____________________________________________\n`;
          }
          console.log(c);
          fs.appendFile(
            "log.txt",
            `${command}  "${artist.split("+").join(" ")}"\n${c}`,
            function(err) {
              if (err) {
                return console.log(err);
              }
            }
          );
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
function Song_Info(song) {
  spotify.search({ type: "track", query: song, limit: 5 }, function(err, data) {
    if (err) {
      return console.log("Error occurred");
    } else {
      if (data.tracks.items.length === 0) {
        console.log("Song not found!");
      } else {
        var c = "";
        for (let j = 0; j < data.tracks.items.length; j++) {
          if (
            (song === "The Sign" &&
              data.tracks.items[j].artists[0].name === "Ace of Base") ||
            song !== "The Sign"
          ) {
            c +=
              "________________________________________________________________________________\n\n";

            if (data.tracks.items[j].artists.length === 1) {
              c += `Artist:  ${data.tracks.items[j].artists[0].name}\n`;
            } else {
              c += "Artists:\n";
              for (let i = 0; i < data.tracks.items[j].artists.length; i++) {
                c += `   - ${data.tracks.items[j].artists[i].name}\n`;
              }
            }

            c += `Song:  ${data.tracks.items[j].name}
Spotify Link:  ${data.tracks.items[j].external_urls.spotify}
Album Name:  ${data.tracks.items[j].album.name}\n`;
          }
        }
        c +=
          "________________________________________________________________________________\n";
        console.log(c);
        fs.appendFile(
          "log.txt",
          `${command}  "${song.split("+").join(" ")}"\n${c}`,
          function(err) {
            if (err) {
              return console.log(err);
            }
          }
        );
      }
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
    var song = "";

    if (process.argv[3] === undefined) {
      song = "The Sign";
    } else {
      song = Name();
    }

    Song_Info(song);

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
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }

      var FArr = data.split("\n");
      for (let i = 0; i < FArr.length; i++) {
        var dataArr = FArr[i].split(",");

        var com = dataArr[0];
        var n = dataArr[1].split('"');
        var name = n[1];

        switch (com) {
          case "concert-this": {
            Artist_Info(name);
            break;
          }
          case "spotify-this-song": {
            Song_Info(name);
            break;
          }
          case "movie-this": {
            Movie_Info(name);
            break;
          }
        }
      }
    });

    break;

  default:
    console.log("Enter a command to do");
    break;
}

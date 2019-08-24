require("dotenv").config();

// var request = require("request");
var Spotify = require("node-spotify-api");
var axios = require("axios");
const moment = require("moment");
const fs = require("fs");
var inquirer = require("inquirer");

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
        Enter_Name("movie-this");
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
          `movie-this  "${movie.split("+").join(" ")}"\n${c}`,
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
      Commands_Cons();
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
        console.log("It was not found");
        Enter_Name("concert-this");
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
            `concert-this  "${artist.split("+").join(" ")}"\n${c}`,
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
      Commands_Cons();
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function Song_Info(song) {
  spotify.search({ type: "track", query: song, limit: 5 }, function(err, data) {
    if (err) {
      return console.log("Error occurred");
      Commands_Cons();
    } else {
      if (data.tracks.items.length === 0) {
        console.log("Song not found!");
        Enter_Name("spotify-this-song");
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
          `spotify-this-song  "${song.split("+").join(" ")}"\n${c}`,
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
function Commands_Cons(command, name) {
  if (process.argv[2] !== undefined && command === undefined) {
    command = process.argv[2];
  }
  if (process.argv[3] !== undefined && name === undefined) {
    name = Name();
  }

  switch (command) {
    case "concert-this":
      if (name === undefined || name === "") {
        Enter_Name(command);
      } else {
        Artist_Info(name);
      }

      break;
    case "spotify-this-song":
      if (name === undefined || name === "") {
        name = "The Sign";
      }
      Song_Info(name);

      break;
    case "movie-this":
      if (name === undefined || name === "") {
        name = "Mr. Nobody.";
      }

      Movie_Info(name);

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
      inquirer
        .prompt([
          {
            type: "list",
            message: "Please Choose A Command",
            choices: [
              "movie-this",
              "concert-this",
              "spotify-this-song",
              "do-what-it-says",
              "finish"
            ],
            name: "com"
          }
        ])
        .then(function(inquirerResponse) {
          if (inquirerResponse.com !== "finish") {
            if (inquirerResponse.com !== "do-what-it-says") {
              Enter_Name(inquirerResponse.com);
            } else {
              Commands_Cons(inquirerResponse.com, "");
            }
          }
        });
      break;
  }
}

function Enter_Name(com) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter A Name, or 'fin' To Finish",
        name: "n"
      }
    ])
    .then(function(inquirerResponse2) {
      if (inquirerResponse2.n !== "fin" && inquirerResponse2.n !== "'fin'") {
        Commands_Cons(com, inquirerResponse2.n.split(" ").join("+"));
      }
    });
}

Commands_Cons();

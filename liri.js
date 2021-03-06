// VARIABLES AND REQUIRED FILES
var dot = require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api")
moment().format();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var query = process.argv[2];
var argRaw = process.argv;

// SWITCH STATEMENT FOR LIRI APP
switch (query) {
  case "movie-this":
    movieThis();
    break
  case "spotify-this-song":
    spotifyThis();
    break
  case "concert-this":
    concertThis();
    break
  case "do-what-it-says":
    thatWay();
    break
};

// API'S
// movie-this
function movieThis() {

  // REDEFINES THE ARGUEMENT FOR THE FUNCTION
  var movieTitle = argRaw.slice(3).join("+");
  console.log(keys.movies)
  axios.get(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${keys.movies.id}`)
    .then(function (res) {

      // MOVIE VARIABLES
      var title = res.data.Title;
      var year = res.data.Year;
      var imdb = res.data.imdbRating;
      var rotTomat = res.data.Ratings[1].Value;
      var local = res.data.Country;
      var lang = res.data.Language;
      var plot = res.data.Plot;
      var actors = res.data.Actors;

      // creating variables to send info to log.txt
      var line1 = `\nMovie Title: ${title}\nRelease Year: ${year}`
      var line2 = `IMDB Rating: ${imdb}\nRotten Tomatoes: ${rotTomat}`
      var line3 = `Country: ${local}\nLanguages: ${lang}`
      var line4 = `Actors: ${actors}\n\nPlot: ${plot}\n`
      var line5 = `--------------------------------`

      console.log(line1);
      console.log(line2);
      console.log(line3);
      console.log(line4);
      console.log(line5);

      printLog(line1, line2, line3, line4, line5);

    })
    .catch(function (err) {
      if (err) {
        console.log("--------------------------------");
        console.log("\nSorry we don't have enough data on that movie! Try somewhere else.\n");
        throw err;
      };
    });
};

// // spotify-this-song
function spotifyThis(newArg) {

  if (newArg) {
    var track = newArg.join("+")
    var limit = "1";
  } else {
    var track = argRaw.slice(3).join("+");
    var limit = "5";
  };

  spotify
    .request(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=${limit}`)
    .then(function (res) {

      for (let i = 0; i < res.tracks.items.length; i++) {
        var artist = res.tracks.items[i].artists[0].name;
        var song = res.tracks.items[i].name;
        var link = res.tracks.items[i].external_urls.spotify;
        var album = res.tracks.items[i].album.name;

        var line1 = `--------------------------------`
        var line2 = `Artist(s): ${artist}`
        var line3 = `Song Title: ${song} ${link}`
        var line4 = `Album: ${album}`
        var line5 = `--------------------------------`

        console.log(line1);
        console.log(line2);
        console.log(line3);
        console.log(line4);
        console.log(line5);

        printLog(line1, line2, line3, line4, line5);

      };

      // "Jesus, what a pain in the ass...""
      // - Riley Barlow

    })
    .catch(function (err) {
      if (err) {
        console.log("--------------------------------");
        console.log("\nSorry we don't have enough data on that song! Try somewhere else.\n");
        throw err;
      };
    });
};

// concert-this
function concertThis() {

  var artistConc = argRaw.slice(3).join("+");
  // console.log(artistConc);
  console.log(keys.bands)

  axios.get(`https://rest.bandsintown.com/artists/${artistConc}/events?app_id=${keys.bands}`)

    .then(
      function (res) {
        var concerts = res.data;
        // console.log(concerts);

        concerts.forEach(function (concerts) {
          var venue = concerts.venue.name;
          var city = concerts.venue.city;
          var country = concerts.venue.country;
          var date = concerts.datetime;
          var parsedDate = moment(date).format(`DD-MM-YYYY`);

          var line1 = `--------------------------------`
          var line2 = `Venue: ${venue}`
          var line3 = `Location: ${city}, ${country}`
          var line4 = `Date: ${parsedDate}`
          var line5 = `--------------------------------`

          console.log(line1);
          console.log(line2);
          console.log(line3);
          console.log(line4);
          console.log(line5);

          printLog(line1, line2, line3, line4, line5);

        });
      })
    .catch(
      function (err) {
        if (err) {
          console.log("--------------------------------");
          console.log("\nSorry we don't have enough data on that song! Try somewhere else.\n");
          throw err;
        };
      });
};

// // do-what-it-says
function thatWay() {

  fs.readFile("./random.txt", "utf8", function (err, data) {

    if (err) {
      return console.log(err);
    };

    // CREATES A NEW ARGUEMENT TO USE IN SPOTIFYthis();
    var dataArr = data.split(",");
    var newArg = dataArr[1].split(" ");

    // CALLS SPOTIFYthis WHILE PASSING THE ARG INTO IT
    spotifyThis(newArg);

  });
};

// PRINGTS TO THE LOG.TXT FILE IN ORDER TO SAVE DATA FOR THE USER
function printLog(line1, line2, line3, line4, line5) {

  var text = `\n${line1}\n${line2}\n${line3}\n${line4}\n${line5}`

  fs.appendFile("log.txt", text, function (err) {
    if (err) {
      return console.log(err);
    }
  })
}
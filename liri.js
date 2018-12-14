require("dotenv").config();
var fs = require('fs')
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var arg = process.argv
var axios = require("axios")
var spotify = new Spotify(keys.spotify);
var moment = require("moment")

moment().format()


function concertThis(artist) {
    artist = artist.replace(" ", "%20")
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming").then(
        function (data) {
            for (i in data.data) {
                let date = data.data[i].datetime
                let newDate = date.slice(0, 10)
                let venue = data.data[i].venue
                let date2 = moment(newDate).format("MM-DD-YYYY")
                console.log("Venue: "+venue.name + "\n Location: " + venue.country + ", " + venue.city + ", " + venue.region + "\n Date: " + date2+"\n \n")
            }

        }
    )
}

function spotifyThis(song) {
    song = song || "The Sign"

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let songs = data.tracks.items
        for (i in songs) {

            console.log("Artist: "+data.tracks.items[i].artists[0].name+ "\n Album: " +data.tracks.items[i].album.name+"\n Song: "+data.tracks.items[i].name+"\n Url: ", data.tracks.items[i].external_urls.spotify+"\n \n")
        }
    })
}

function movieThis(title){
    title = title|| "Mr. Nobody"
    title = title.replace(" ", "%20") 
    let key = "a9493a0a"
    axios.get("http://www.omdbapi.com/?apikey="+key+"&t="+ title).then(
        function(data){
            console.log("Title: "+data.data.Title +"\n Year: "+data.data.Year+"\n IMDB: "+data.data.Ratings[0].Value+"\n Rotten Tomatoes: "+data.data.Ratings[1].Value+"\n Lang: "+data.data.Language+"\n Plot: "+data.data.Plot+"\n Actors: "+data.data.Actors)
        })

    
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(err,data){

        if (err){ return console.log ("feelsbadman :" + err)}
       
           data = data.split(",").map(x => x.trim())
           switch (data[0]) {
            case `concert-this`: concertThis(data[1]);  break;
        
            case `spotify-this-song`: spotifyThis(data[1]);  break;
        
            case `movie-this`: movieThis(data[1]); break;
           }
       
        console.log(data)
       })

}

switch (arg[2]) {
    case `concert-this`: concertThis(arg[3]);  break;

    case `spotify-this-song`: spotifyThis(arg[3]);  break;

    case `movie-this`: movieThis(arg[3]); break;

    case `do-what-it-says`: doWhatItSays(); break;

    default: console.log("Sorry, I didn't understand what you asked")
}



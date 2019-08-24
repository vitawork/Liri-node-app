# LIRI (Language Interpretation Recognition Interface)

A Node.JS command line application, it takes one of following commands and performs an action.
   * movie-this
   * concert-this
   * spotify-this-song
   * do-what-it-says
## Start
Type in **node liri**, you can either type the commands or wait to select one from the menu.
  
  ![Image of menu](1.png)

In case of **movie-this**, **concert-this**, **spotify-this-song** you need to add the name as a second parameter, you can either type it continually or wait to be asked for it.

## Retreiving back

   ###  movie-this
         It is showing a movie information:

           - Title of the movie.
           - Year the movie came out.
           - IMDB Rating of the movie.
           - Rotten Tomatoes Rating of the movie.
           - Country where the movie was produced.
           - Language of the movie.
           - Plot of the movie.
           - Actors in the movie.
   ![Image of menu](2.png)
    
   ###  concert-this
         It is showig the events information for this artist(s)

           - Name of the venue
           - Venue location
           - Date of the Event
   ![Image of menu](3.png)
         
   ###  spotify-this-song
         It is showing at most 5 songs information related to the song name you entered
           
           - Artist(s)
           - The song's name
           - A preview link of the song from Spotify
           - The album that the song is from
   ![Image of menu](4.png)

   ###  do-what-it-says
         LIRI will take the text inside of random.txt and then use it to call the LIRI's commands it says.  

## APIs
   * Bands in Town
   * Open Movie Database
   * Spotify
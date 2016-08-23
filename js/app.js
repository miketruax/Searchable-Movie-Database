!(function(){ //self executing anonymous functions are our friends
  $(document).ready(function(){
    $('#submit').click(function(e){ //sets up even
      e.preventDefault(); //keeps form submission and reload from happening

      //sets up information to be passed as part of search
      var queryData = {s: $('#search').val(), y: $('#year').val(), r: 'JSON'};

      $.getJSON('http://www.omdbapi.com/', queryData, function(data){ //calls for JSON data
        if(data.Response === "True"){ //if successful and movies are found
          populateMovies(data); //populates the movies
        }

        //if no movies found, sets error message to let user know nothing was found
        //with the give search parameters
        else if (data.Error ==="Movie not found!"){
          var noMovies = ' No movies found that match: ' + $('#search').val();
          if($('#year').val()){ noMovies += ' in the year: '+$('#year').val();}
          populateError(noMovies);
        }

        //in case of any other error from OMDB, populates the default unknown
        //error has occured message
        else {
          var otherError = 'An unknown error occured.<br> Ensure your search contains';
          otherError += ' at least two characters and please try again shortly.'
          populateError(otherError);
        }
      });
    });
    /*This function builds the outer list with appropriate class then adds
    the i to it as well as the the appropriate message based off the string
    that was passed into the function. It then appends it to the #movies element.
    */
    var populateError = function(errorMessage){
      var $i = "<i class='material-icons icon-help'>help_outline</i>";
      var li = document.createElement('li');
      $(li).addClass('no-movies');
      $(li).html($i + errorMessage);
      $('#movies').html(li);
    };

    var populateMovies = function(movieList){
      console.log(movieList);
      $('#movies').html(''); //clears the #movies to empty
      $.each(movieList.Search, function(key, movie){
        //creates outer link for imdb and adds href
        var li ='<li><div class="poster-wrap">'
        li += '<a href="http://www.imdb.com/title/'+movie.imdbID;
        li += '" target="blank">'+getPoster(movie.Poster)+'</a></div>';
        li += '<span class="movie-title">'+movie.Title+'</span>';
        li += '<span class="movie-year">'+movie.Year+'</span>' +'</li>';
        $('#movies').append(li);
      });
    };
  var getPoster = function(posterLink){
    if(posterLink ==="N/A"){
      return '<i class="material-icons poster-placeholder">crop_original</i>'
    }
    else {
      return '<img class="movie-poster" src="'+posterLink+'">'
    }

  }

  });


})();

!(function(){ //self executing anonymous functions are our friends
  "use strict";
  $('#movies').html('');
    $('#submit').click(function(e){ //sets up even
      e.preventDefault(); //keeps form submission and reload from happening
      pullMovies(1); //pulls movies passing 1 for just the first page
      hideMoreInfo();
    });

var pullMovies = function(page){
  $('#movies').html('<div class="centered">LOADING...<br><img src="./css/bar.gif"></div>');
  var queryData = {s: $('#search').val(),
                   y: $('#year').val(),
                   type: "movie", //this is a movie search afer all, not TV search
                   r: 'JSON', page: page}; //info to be passed to API

    $.getJSON('http://www.omdbapi.com/', queryData, function(data){ //calls for JSON data
      if(data.Response === "True"){ //if successful and movies are found
        populateMovies(data); //populates the movies
        createPagination(data.totalResults, page);//adds pagination to the bottom of the page
      }
      else if (data.Error ==="Movie not found!"){ //sets error if no movie found
        var noMovies = ' No movies found that match: ' + $('#search').val();
        if($('#year').val()){ noMovies += ' in the year: '+$('#year').val();}
        populateError(noMovies, $('#movies')); //sets error to #movies
      }
      else { //in case of other error with JSONP call
        var otherError = 'An unknown error occured.<br> Ensure your search contains';
        otherError += ' at least two characters and please try again shortly.';
        populateError(otherError, $('#movies'));
      }
    });
};


    var populateError = function(errorMessage, insertInto){ //creates error li element
      var li = '<li class="no-movies">';
      li+= '<i class="material-icons icon-help">help_outline</i>';
      li += errorMessage+'</li>';
      $(insertInto).html(li); //adds li to the #movies element
    };

    var populateMovies = function(movieList){
      $('#movies').html(''); //resets #movies to ensure nothing was lingering

      //cycles through each movie updating information to the li item
      $.each(movieList.Search, function(key, movie){
        var li ='<li><div class="poster-wrap">';
        li += '<a href="http://www.imdb.com/title/'+movie.imdbID+'" target="blank">';
        li += getPoster(movie.Poster, 'movie-poster')+'</a></div>';
        li += '<span class="movie-title" id="'+movie.imdbID+'">'+movie.Title+'</span>';
        li += '<span class="movie-year">'+movie.Year+'</span>' +'</li>';
        $('#movies').append(li); //adds one li at a time as they are built
      });
    };

  var getPoster = function(posterLink, posterClass){ //sends poster link from movie object
    if(posterLink ==="N/A"){ //if no poster, sets default img
      if(posterClass ==='more-poster'){ //fixes styling issue on more info page
        return '<i class="material-icons more-placeholder">crop_original</i>';
      }

      else{
        return '<i class="material-icons poster-placeholder">crop_original</i>';
      }
    }

    else {
      return '<img class="'+posterClass+'" src="'+posterLink+'">'; //returns link
    }
  };

  var showMore = function(){ //title is clicked hides search results and shows more info
    $('#movies').hide();
    $('#pagination-div').hide();
    $('#expandedInfo').show('slow');
    collectMoreInfo($(this).attr('id')); //recalls OMDBapi to get specifics on movie clicked
  };

  var collectMoreInfo = function(id){ //passes id of item clicked
    $('#expandedInfo').html('<div class="centered">LOADING...<br><img src="./css/bar.gif"></div>');
    var queryData = {i: id, plot:'full', r: 'json'}; //sets search param for more info
    $.getJSON('http://www.omdbapi.com/', queryData, function(data){ //calls direct imdb id search
      if(data.Response=="True"){ //if response is valid JSON movie info, show contanier and populate info
        populateMoreInfo(data); //populates the data
      }
      else{ //in case an error occurs retreiving the information
        var error = 'Could not find information. Please try again later.';
        error += ' We apologize for any inconvenience.';
        populateError(error, $('#expandedInfo')); //populates error to expandedInfo id
      }
    });
  };

  var populateMoreInfo = function(movie){ //builds more info one block at a time
    var moreHTML = '<div class="top-grey">';
    moreHTML+='<button class="back">  &#10094; Search results</button><br>'; //back button
    moreHTML += '<span class="more-title">'+movie.Title+' ('+movie.Year+')</span><br>'; //title and year
    moreHTML += '<span class="more-title more-rating">IMDB Rating: '+movie.imdbRating+'</span></div>'; //imdb rating
    moreHTML += getPoster(movie.Poster, 'more-poster')+'<div class ="more-synopsis">'; //poster
    moreHTML += '<h3>Plot Synopsis:</h3><p class="synopsis">'+movie.Plot+'</p>'; //plot
    moreHTML +='<a class="imdb-button" href="http://www.imdb.com/title/'+movie.imdbID; // link to imdb button
    moreHTML += '" target="_blank">View on IMDB</a></div>'; //closing it all out
    $('#expandedInfo').html(moreHTML); //adding it to container div
  };


  var createPagination = function(responseNumber, page){   //this is the function that creates the pagination buttons on the bottom
    var numButtons = Math.ceil(responseNumber/10); // 10 per page then rounds up so 84->9pages 24->3 pages etx
    page = parseInt(page); //occasionally page decided it was meant to be a string, causing issues
    $('#pagination-div').html(''); //clears old pagination
    if(numButtons!==1){ //if only one button no need to add paginate links
      var html = '<div class="pagination"><ol id="buttons">'; //sets-up starting tags
      //the number passed is how many pages there should be and therefore how many links there should be
      for(var i=(page-5); i <= (page+5); i++){
        if(i>0 && i<=numButtons){
          html += '<li><a class="pag-button" href="#" id="'+i+'">'+i+'</a></li>'; //builds each button one at a time
        }
      }
      html +='</ol></div>'; //closes tags
      $('#pagination-div').html(html); //adds pagination to the appropriate div
      addJumpTo(numButtons, page);
      $('#'+page).addClass('active'); // if more than one, the page passed in becomes active button
      $('select[name="pagejump"]').val(page);
      createFirstLast(page, numButtons);
    }
  };

  var createFirstLast = function(current, max){
    if(current !== 1){ //if not on the last page, adds jump to last page
        var first ='<li><a class="first jumper" href="#">&#8606;first</a></li>';
        $('#buttons').prepend(first);
        $('.first').on('click', function(){
          pullMovies(1);
        });
    }

    if(current !== max){ //if not on the last page, adds jump to last page
        var last ='<li><a class="last" href="#">last &#8608;</a></li>';
        $('#buttons').append(last);
        $('.last').on('click', function(){
          pullMovies(max);
        });
    }
  };

  var addJumpTo = function(numOptions, currentOption){
    var select='<div class="select">Jump to page: <select name="pagejump">';
    for(var i=1; i<=parseInt(numOptions); i++){
      select+='<option value="'+i+'">'+i+'</option>';
    }
    select+= '</select><a id="jump-to" href="#">Go!</a></div>';
    $('#pagination-div').append(select);
    $('#jump-to').on('click', function(){
      pullMovies($('select[name="pagejump"]').val());
    });
  };


  var hideMoreInfo = function(){ //when back button is clicked or new search on more info page
    $('#movies').show(); //shows #movies results
    $('#expandedInfo').hide(); //hides expandedInfo
    $('#pagination-div').show(); //shows pagination div again
  };

$('body').on('click','.movie-title', showMore); //any movie title clicked goes to more info
$('body').on('click','.back', hideMoreInfo);

$('body').on('click','.pag-button', function(){
  pullMovies($(this).attr('id')); //pulls movies on the page that the pagination was clicked
});

})();

!(function(){ //self executing anonymous functions are our friends
  "use strict";
  $(document).ready(function(){
    $('#submit').click(function(e){ //sets up even
      e.preventDefault(); //keeps form submission and reload from happening
      var queryData = {s: $('#search').val(), y: $('#year').val(), r: 'JSON'}; //info to be passed to API
      $.getJSON('http://www.omdbapi.com/', queryData, function(data){ //calls for JSON data
        console.log(data);
        if(data.Response === "True"){ //if successful and movies are found
          populateMovies(data); //populates the movies
        }
        else if (data.Error ==="Movie not found!"){ //sets error if no movie found
          var noMovies = ' No movies found that match: ' + $('#search').val();
          if($('#year').val()){ noMovies += ' in the year: '+$('#year').val();}
          populateError(noMovies, $('#movies'));
        }
        else { //in case of other error with JSONP call
          var otherError = 'An unknown error occured.<br> Ensure your search contains';
          otherError += ' at least two characters and please try again shortly.';
          populateError(otherError, $('#movies'));
        }
      });
    });
  });

    var populateError = function(errorMessage, insertInto){ //creates error li element
      var $i = "<i class='material-icons icon-help'>help_outline</i>";
      var li = document.createElement('li');
      $(li).addClass('no-movies');
      $(li).html($i + errorMessage); //adds appropriate error message
      $(insertInto).html(li); //adds li to the #movies element
    };

    var populateMovies = function(movieList){
      $('#movies').html('');
      $.each(movieList.Search, function(key, movie){

        var li ='<li><div class="poster-wrap">';
        li += '<a href="http://www.imdb.com/title/'+movie.imdbID;
        li += '" target="blank">'+getPoster(movie.Poster)+'</a></div>';
        li += '<span class="movie-title" id="'+movie.imdbID+'">'+movie.Title+'</span>';
        li += '<span class="movie-year">'+movie.Year+'</span>' +'</li>';
        $('#movies').append(li);
      });
    };
  var getPoster = function(posterLink){
    if(posterLink ==="N/A"){ //if no poster, sets default img
      return '<i class="material-icons poster-placeholder">crop_original</i>';
    }
    else {
      return '<img class="movie-poster" src="'+posterLink+'">';
    }
  };

  var showMore = function(){
    $('#movies').hide('fast');
    $('#expandedInfo').show('slow');
    console.log($(this).attr('id'))
    collectMoreInfo($(this).attr('id'));
  };

  var collectMoreInfo = function(id){
    var queryData = {i: id, plot:'full', r: 'json'}; //sets search param for more info
    $.getJSON('http://www.omdbapi.com/', queryData, function(data){
      if(data.Response=="True"){ //if response is valid JSON movie info, show contanier and populate info
        $('#more-container').show();
        console.log(data);
        populateMoreInfo(data);
      } else{
        var error = 'Could not find information. Please try again later.';
        error += ' We apologize for any inconvenience.';
        populateError(error, $('#expandedInfo'));
      }
    });
  };

var populateMoreInfo = function(movie){
  var populateHTML = '<div class="top-grey"><button class="back">  &#10094; Search results';
  populateHTML += '</button><br><span class="more-title">'+movie.Title+' ('+movie.Year+')</span><br>';
  populateHTML += '<span class="more-title more-rating">IMDB Rating: '+movie.imdbRating+'</span></div>';
  populateHTML +='<img class="more-poster" src="'+movie.Poster+'"><div class ="more-synopsis">';
  populateHTML += '<h3>Plot Synopsis:</h3><p class="synopsis">'+movie.Plot+'</p>';
  populateHTML +='<a class="imdb-button" href="http://www.imdb.com/title/'+movie.imdbID;
  populateHTML += '">View on IMDB</a></div>';
  $('#expandedInfo').html(populateHTML);
};

  //adds event listener to current and all added .movie-title(s)
  $('body').on('click', '.movie-title', showMore);
  $('body').on('click', '.back', function(){ //reshows search results from more info page
    $('#movies').show('slow');
    $('#expandedInfo').hide('fast');
    $('#more-container').hide(); //hides the contaning DIV on more info page
  });
  var tester = function(){
    console.log('global working');
  };


  var createPagination = function(responseNumber){   //this is the function that creates the pagination buttons on the bottom
    responseNumber = Math.ceil(responseNumber.length/10); // 10 per page then rounds up so 84->9pages 24->3 pages etx
    resetPaginationLinks(); //clears old buttons
    var outerDiv = document.createElement('div'); //starts with outer div
    var ol = document.createElement('ol'); //builds inner ol
    outerDiv.classList.add('pagination');
    outerDiv.appendChild(ol);
    for(var i=1; i<=buttonCount; i++){ //the number passed is how many pages there should be and therefore how many links there should be
      var list = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.id= i; //easier to grab the buttons for active class (could be done with document.getElementsByClassName('pagination').etc.. but this is muuuuch easier)
      a.innerHTML = i;
      list.appendChild(a);
      ol.appendChild(list);
      $(a).on('click', clickPagination); //adds the event listener here at creation for simplicity's sake
      $('.pagination-div')[0].appendChild(outerDiv); // adds them to the main page
      if(buttonCount===1){$(a).hide();} //hides button if only one present
  }
};

var clickPagination = function(number){ //on click filters to correct page
  for(var i = 0; i <allMovies.length; i++){ //cycles through all students and reHides
      $(allMovies[i]).hide();
    }
  $('#'+active).toggleClass('active'); //removes class from only the currently active item. using id avoids having to loop through all of them
  active = this.id; //sets active to clicked button
  $('#'+active).toggleClass('active'); //sets active to current page button
  for(var k = 0; k <10; k++){ //cycles through 10 items for the current page
    var currentItem = allMovies[k+10*(active-1)];//simple math to know which indeces to pull i.e. button 3 clicked which makes active =3 so it should be 21-30 with [i+10*(3-1)] = i+10*2 = i(0-9)+20 for the correct index
    if(currentItem){
      $(currentItem).stop().fadeIn(800); //fixes animation queue to keep things from populating if you're typing too fast
    }
  }
};

var resetPaginationLinks = function(){ //resets the pagionation links
  var pagination = $('.pagination')[0];
  if (pagination){ //this is to ensure there are no console errors if someone KEEPS typing in search even after the pagination links are removed as there won't be pagination links to remove
    $(pagination).remove();
  }
};


})();

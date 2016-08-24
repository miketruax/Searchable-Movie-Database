var movieModule = (function(my){
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

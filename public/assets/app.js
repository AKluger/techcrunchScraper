$(document).ready(function() {

$("#articleList").empty();

  $(document).on("click", "#newScrape", function(event) {
    event.preventDefault();
    $.get("/scrape").then(function() {
      location.reload();
        // this button should scrape articles and if they arent already in the db add them to the articles list then rerender the page
  } );
  })

  $(document).on("click", ".saveArticle", function(event) {
    event.preventDefault();
    // this button should change the article 'saved' prop from false to true, and remove its parent element...perhaps changing data-attribute of parent
  })

    $(document).on("click", "#removeArticle", function(event) {
        event.preventDefault();
        // this button should change article saved prop to false 
    })

        $(document).on("click", "#viewNotes", function(event) {
            event.preventDefault();
            // this button will open notes modal, effectively getting notes where id matches.  this.notes 
        })

      })
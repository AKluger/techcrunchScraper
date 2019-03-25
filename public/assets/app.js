$(document).ready(function () {

  // $("#articleList").empty();

  $("#newScrape").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape").then(function () {
      console.log("reload!!");
      window.location.reload();// this button should scrape articles and if they arent already in the db add them to the articles list then rerender the page
    });
  })

  // REFERENCE BURGER SOLUTION
  // TRY PASSING THE SCRAPE RESULT TO CLIENTSIDE BEFORE DB
  $(".saveArticle").on("click", function (event) {
    event.preventDefault();
    const article_id = (this.getAttribute("data-id"));
    // why isnt this capturing the data-id???
    console.log(article_id);

    $.ajax({
      method: "PUT",
      url: "/"+ article_id
    }).then(function(data) {
      // reload page to remove saved article
      location.reload();
    });

    });
    // this button should change the article 'saved' prop from false to true, and remove its parent element...perhaps changing data-attribute of parent

  $(document).on("click", "#removeArticle", function (event) {
    event.preventDefault();
    // this button should change article saved prop to false 
  })

  $(document).on("click", "#viewNotes", function (event) {
    event.preventDefault();
    // this button will open notes modal, effectively getting notes where id matches.  this.notes 
  })

})
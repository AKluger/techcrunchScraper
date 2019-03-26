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
    let articleId = (this.getAttribute("data-id"));
    console.log(articleId);

    $.ajax({
      method: "PUT",
      url: "/articles/" + articleId,
      data: articleId
    }).then(function (data) {
      // reload page to remove saved article
      location.reload();
    });

  });
  // this button should change the article 'saved' prop from false to true, and remove its parent element...perhaps changing data-attribute of parent

  $(".deleteArticle").on("click", function (event) {
    event.preventDefault();
    let articleId = (this.getAttribute("data-id"));
    $.ajax({
      method: "DELETE",
      url: "/saved/" + articleId
    })
    .then(function(data) {
      // Log the response
      console.log(data);
      location.reload();
    });
  })


  $(".viewNotes").on("click", function (event) {
    event.preventDefault();

    let articleId = (this.getAttribute("data-id"));
    $("#articleId").text(articleId);



  })

  $(".deleteNote").on("click", function (event) {
    event.preventDefault();
    let noteId = (this.getAttribute("data-id"));
    $.ajax({
      method: "DELETE",
      url: "/notes/" + noteId
    })
    .then(function(data) {
      // Log the response
      console.log(data);
      location.reload();
    });
  })
})
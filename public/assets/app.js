$(document).ready(function () {

  $("#newScrape").on("click", function (event) {
    event.preventDefault();
    $.get("/scrape").then(function () {
      console.log("reload!!");
      window.location.reload();// this button should scrape articles and if they arent already in the db add them to the articles list then rerender the page
    });
  })

  // update article saved attribute to true
  $(".saveArticle").on("click", function (event) {
    event.preventDefault();
    let articleId = (this.getAttribute("data-id"));

    $.ajax({
      method: "PUT",
      url: "/articles/" + articleId,
      data: articleId
    }).then(function (data) {
      // reload page to remove saved article
      location.reload();
    });

  });

  // remove an article
  $(".deleteArticle").on("click", function (event) {
    event.preventDefault();
    let articleId = (this.getAttribute("data-id"));
    $.ajax({
      method: "DELETE",
      url: "/saved/" + articleId
    })
      .then(function (data) {
        location.reload();
      });
  })

  // function to render the notes in the modal
  $(".viewNotes").on("click", function (event) {
    event.preventDefault();

    let articleId = (this.getAttribute("data-id"));
    $("#articleId").text(articleId);
    $(".notes").empty();

    $.get("/notes/" + articleId).then(function (data) {

      let notes = data[0].notes;
      if (!notes.length) {
        let note = $("<li class='list-group-item'>No Notes Yet..</li>")
        $(".notes").append(note);
      }

      else {
        for (let i = 0; i < notes.length; i++) {
          let note = $("<li class='list-group-item' ></li>").text(notes[i].body)
            .append($("<button class='btn btn-danger ml-2 deleteNote' data-id=" + notes[i]._id + ">x</button>"))
          $(".notes").append(note);
        }
      }
    })

  })

  // function to delete a note from the DB
  $(".deleteNote").on("click", function (event) {
    event.preventDefault();
    let noteId = $(this).data("id")
    console.log(noteId);
    $.ajax({
      method: "DELETE",
      url: "/notes/" + noteId
    })
      .then(function (data) {
        // Log the response
        console.log(data);
        location.reload();
      });
  })

  // function to grab the new note body and send it to DB
  $(".addNote").on("click", function (event) {
    event.preventDefault();
    let noteMessage = $("#noteContent").val().trim();
    let newNote = { body: noteMessage };
    let articleId = $("#articleId").text()
    $.ajax({
      method: "POST",
      url: "/addNote/" + articleId,
      data: newNote
    })
      .then(function (data) {
        // Log the response
        console.log(data);
        location.reload();
      });
  })
})
const logger = require("morgan");
const mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Requiring our models
const db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/crunchydb";
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// { useNewUrlParser: true }


// Routes
module.exports = function (app) {
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://techcrunch.com/").then(function (response) {

      // Load the Response into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      let $ = cheerio.load(response.data);

      // An empty array to save the data that we'll scrape
      let results = [];

      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("h2.post-block__title").each(function (i, element) {

        // Save the text of the element in a "title" variable
        let title = $(element).children("a").text();
        title = title.replace('\n\t\t\t\t', '');
        title = title.replace('\t\t\t', '');


        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        let link = $(element).children("a").attr("href");

          var summary = $(element).closest(".post-block").children(".post-block__content").text();
          summary = summary.replace('\n\t\t', '');
          summary = summary.replace('\t', '');
        //   summary = $(summary).children("p").text();

        //     console.log(summary);

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
          title: title,
          link: link,
          summary: summary,
          saved: false
        });

        //   var handlebarObject = {
        //       article: results
        //   };
        //   res.render("index", handlebarObject);


        // Create a new Article using the `result` object built from scraping
        db.Article.create(results)
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
          
      });

      // Log the results once you've looped through each of the elements found with cheerio
      console.log(results);
      res.redirect("/");
    });

    // Send a message to the client
    // res.redirect("/articles");
  });


  // Route for getting all Articles from the db
  app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        var newObject = {
          article: dbArticle
        };

        res.render("index", newObject);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for retrieving all Notes from the db
  app.get("/notes", function (req, res) {
    // Find all Notes
    db.Note.find({})
      .then(function (dbNote) {
        // If all Notes are successfully found, send them back to the client
        res.json(dbNote);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

  // Route for retrieving all saved articles from the db
  app.get("/saved", function (req, res) {
    // Find all Notes
    db.Article.find({ saved: true })
      .then(function (dbArticle) {
        var newObject = {
          article: dbArticle
        };
        // need to render saved page not index page
        res.render("saved", newObject);
      })
      .catch(function (err) {
        // If an error occurs, send the error back to the client
        res.json(err);
      });
  });

    // Route for updating article to Saved = true
    app.put("/articles/:id", function (req, res) {
      db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: {"saved": true}})
        .then(() => res.status(200))
        .catch(function (err) {
          // If an error occurs, send the error back to the client
          res.json(err);
        });
    });

  app.post("/addNote", function (req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article and push the new Note's _id to the Article's `notes` array
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function (dbArticle) {
        // If the Article was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });


  })

  //Route for deleting an article from the db
app.delete("/saved/:id", function(req, res) {
  db.Article.deleteOne({ _id: req.params.id })
  .then(function(removed) {
    res.json(removed);
  }).catch(function(err,removed) {
      // If an error occurred, send it to the client
        res.json(err);
    });
});


//Route for deleting a note
app.delete("/notes/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
  .then(function(removed) {
    res.json(removed);
  }).catch(function(err,removed) {
      // If an error occurred, send it to the client
        res.json(err);
    });
});
}
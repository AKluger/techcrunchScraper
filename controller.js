var logger = require("morgan");
var mongoose = require("mongoose");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Requiring our models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/crunchydb", { useNewUrlParser: true });



// Routes
module.exports = function(app)  {
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://techcrunch.com/").then(function(response) {

        // Load the Response into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
      
        // An empty array to save the data that we'll scrape
        var results = [];
      
        // With cheerio, find each p-tag with the "title" class
        // (i: iterator. element: the current element)
        $("h2.post-block__title").each(function(i, element) {
      
          // Save the text of the element in a "title" variable
          var title = $(element).children("a").text();
          title = title.replace('\n\t\t\t\t','');
          title = title.replace('\t\t\t','');
          
      
          // In the currently selected element, look at its child elements (i.e., its a-tags),
          // then save the values for any "href" attributes that the child elements may have
          var link = $(element).children("a").attr("href");

        //   var summary = $(element).closest(".post-block__content");
        //   summary = $(summary).children("p").text();
        
        //     console.log(summary);
      
          // Save these results in an object that we'll push into the results array we defined earlier
          results.push({
            title: title,
            link: link,
            // summary: summary,
            saved: false
          });

        //   var handlebarObject = {
        //       article: results
        //   };
        //   res.render("index", handlebarObject);
     

                  // Create a new Article using the `result` object built from scraping
        db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
        });
      
        // Log the results once you've looped through each of the elements found with cheerio
        console.log(results);
      });

      // Send a message to the client
      res.redirect("/articles");
  });


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        var newObject = {
            article: dbArticle
        };
    
        res.render("index", newObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
}
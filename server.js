var express = require("express");
// var logger = require("morgan");
// var mongoose = require("mongoose");

var PORT = process.env.PORT || 8000;
var app = express();


// Use morgan logger for logging requests
// app.use(logger("dev"));

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



require('./controller.js')(app);

app.listen(PORT, function() {
  console.log("Listening on port:%s", PORT);
});

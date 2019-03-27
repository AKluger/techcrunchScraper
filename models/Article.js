const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  link: {
    type: String,
    unique: true,
    required: true
  },
  summary: {
    type: String,
    unique: true,
    required: true
  },

  saved:  {
    type: Boolean,
    default: false
  },
 
  // allows us to populate the Article with an associated Note
  notes: [
    {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
]
});

// create our model from the above schema using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

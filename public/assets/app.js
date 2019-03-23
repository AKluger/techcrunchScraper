

  $(document).on("click", "#newScrape", function(event) {
    event.preventDefault();
    $.get("/scrape").then(function(data) {
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


        axios.get("https://pitchfork.com/reviews/best/albums/").then(function(response) {

            // Load the Response into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);
          
            // An empty array to save the data that we'll scrape
            var results = [];
          
            // With cheerio, find each p-tag with the "title" class
            // (i: iterator. element: the current element)
            $("div.review").each(function(i, element) {
          
              // Save the text of the element in a "title" variable
              const title = $(element).find("h2").text();
     
              const image = $(element).find("img").attr("src");
              // In the currently selected element, look at its child elements (i.e., its a-tags),
              // then save the values for any "href" attributes that the child elements may have
              const link = $(element).children("a").attr("href");
    
            //   var summary = $(element).closest(".post-block__content");
            //   summary = $(summary).children("p").text();
            
            //     console.log(summary);
          
              // Save these results in an object that we'll push into the results array we defined earlier
              results.push({
                title: title,
                link: link,
                image: image,
                saved: false
              });
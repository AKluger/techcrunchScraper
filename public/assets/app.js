import { get } from "http";

document.addEventListener('click', function (event) {

	// Don't follow the link
	event.preventDefault();
	// If the clicked element doesn't have the right selector, bail
    if (event.target.matches('#scrape')) 
    
    $.get("/scrape").then(function(data)  {
        alert(data)
        // alert and populate div
    })



}, false);


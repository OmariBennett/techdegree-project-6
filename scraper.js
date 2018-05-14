'use strict';
/* Create a scraper.js file that will contain your command line application.
	Your project should also include a package.json file that includes your project’s dependencies.
	The npm install command should install your dependencies.*/

/* Choose and use two third-party npm packages.
	One package should be used to scrape content from the site.
	The other package should create the CSV file. Be sure to research the best package to use (see the project resources for a link to the video about how to choose a good npm package)
	Both packages should meet the following requirements:
		At least 1,000 downloads
		Has been updated in the last six months*/
	
const fs = require('fs'),
	  osmosis = require('osmosis'),
	  csvFile = require('csvdata');

function formatDate(date) {
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${year}-${month}-${day}`; // show current date-time in console
}

const scrapePopulations = () => {
  return new Promise((resolve, reject) => {
    let results = [];
    osmosis
	.get('http://www.shirts4mike.com/shirts.php')
	.find('.products li a')
	.set({'url': '@href'}) // url
	.follow('@href')
	.find('.shirt-picture span')
	.set({'img': '@src'}) // image url
	.find('.shirt-details')
	.set({'title': 'h1', 'price': 'span'}) // price & title
	.data(result => console.log(result))
    .data(item => results.push(item))
    // .log(console.log)
    .error(console.log)
    .done(() => resolve(results));
  });
}

/* Program your scraper to check for a folder called ‘data’.
	If the folder doesn’t exist, the scraper should create one.
	If the folder does exist, the scraper should do nothing.*/
if (!fs.existsSync('./data')){
   fs.mkdirSync('data');
}

/* Scraping and Saving Data:
	The scraper should get the price, title, url and image url from the product page and save this information into a CSV file.
	The information should be stored in an CSV file that is named for the date it was created, e.g. 2016-11-21.csv.*/

/* Assume that the the column headers in the CSV need to be in a certain order to be correctly entered into a database.
	They should be in this order: Title, Price, ImageURL, URL, and Time*/
scrapePopulations().then(data => {
	const shirts = []
	data.map(x => {
		shirts.push({
			"Title": x.title.split(",").join("").slice(4),
			"Price": x.price.slice(1),
			"ImageURL": x.img,
			"Url": `http://www.shirts4mike.com/${x.url}`,
			"Time": new Date()
		})
		console.log(shirts)
		csvFile.write(`./data/${formatDate(new Date())}.csv`, shirts, {header: 'Title,Price,ImageURL,Url,Time'})
	})
})


/* NOTE:
	To get an "Exceeds Expectations" grade for this project, you'll need to complete each of the items in this section. See the rubric in the "How You'll Be Graded" tab above for details on how you'll be graded.
	If you’re shooting for the "Exceeds Expectations" grade, it is recommended that you mention so in your submission notes.
	// Passing grades are final. If you try for the "Exceeds Expectations" grade, but miss an item and receive a “Meets Expectations” grade, you won’t get a second chance.
	Exceptions can be made for items that have been misgraded in review.*/

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
	  rp = require('request-promise'),
	  cheerio = require('cheerio'),
	  csvFile = require('csvdata');

function formatDate(date) {
  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const day = date.getDate(),
  		month = date.getMonth(),
  		year = date.getFullYear();

  return `${year}-${month}-${day}`; // show current date-time in console
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
	  monthOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const currentDay = daysOfWeek.filter((day, idx) => {if(idx === new Date().getDay()) return day}),
	  CurrnetMonth = monthOfYear.filter((month, idx) => {if(idx === new Date().getMonth()) return month});

const date = new Date(),
	  fullDate = `${currentDay.toString()} ${CurrnetMonth.toString()} ${date.getDate()} ${date.getFullYear()}`
		+ `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} GMT-${date.getTimezoneOffset()} (PST)`;

/* Program your scraper to check for a folder called ‘data’.
	If the folder doesn’t exist, the scraper should create one.
	If the folder does exist, the scraper should do nothing.*/
if (!fs.existsSync('./data')) fs.mkdirSync('data');

/* Scraping and Saving Data:
	The scraper should get the price, title, url and image url from the product page and save this information into a CSV file.
	The information should be stored in an CSV file that is named for the date it was created, e.g. 2016-11-21.csv.*/

/* Assume that the the column headers in the CSV need to be in a certain order to be correctly entered into a database.
	They should be in this order: Title, Price, ImageURL, URL, and Time*/
const url = `http://www.shirts4mike.com/shirts.php`,
	  shirtsUrl = [],
	  shirtsCatalog = [],
	  opt = { url: url, json: true };

rp(opt).then((fullCatalogData)=> {
			fullCatalogData
				.substr(fullCatalogData.indexOf('<li><a href="'), 987)
				.split('</li>')
				.map(x => shirtsUrl.push(x.substring(13, 29)));

			shirtsUrl.pop();
	 		scrapePopulations(shirtsUrl);
		})
		.catch(function (err) {
			const errMessage = `Crawling failed... \n\tError Status ${err.statusCode}\n\t${err.message}\n\t${fullDate}\n`;
			fs.appendFileSync('scraper-error.log', errMessage, {'flags': 'a'});
    	});

function scrapePopulations(shirtsUrl) {
	let i = 0;
	function next() {
		if(i < shirtsUrl.length) {
			let opt2 = { url: `http://www.shirts4mike.com/${shirtsUrl[i]}`, json: true}

			rp(opt2).then((individualShirtData)=> {
				const $ = cheerio.load(individualShirtData)
				shirtsCatalog.push({
					"Title": $('title').text(),
					"Price": $('.price, span').text().trim(),
					"ImageURL": $('img, span').html().trim(),
					"URL":  `http://www.shirts4mike.com/${shirtsUrl[i]}`,
					"Time": fullDate
				})
				csvFile.write(`./data/${formatDate(new Date())}.csv`, shirtsCatalog, {header: 'Title,Price,ImageURL,URL,Time'});
				i++;
				return next();
			})
		}
	}
	return next();
}

/* NOTE:
	To get an "Exceeds Expectations" grade for this project, you'll need to complete each of the items in this section. See the rubric in the "How You'll Be Graded" tab above for details on how you'll be graded.
	If you’re shooting for the "Exceeds Expectations" grade, it is recommended that you mention so in your submission notes.
	// Passing grades are final. If you try for the "Exceeds Expectations" grade, but miss an item and receive a “Meets Expectations” grade, you won’t get a second chance.
	Exceptions can be made for items that have been misgraded in review.*/


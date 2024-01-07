// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
var convert = require("xml-js");

// URL of the page we want to scrape
const url = "http://192.168.1.1/api/device/signal";
const sessionId = "http://192.168.1.1/api/webserver/SesTokInfo";

// Async function which scrapes the data
async function scrapeData() {
  try {
    // Fetch HTML of the page we want to scrape
    const response = await axios.get(sessionId);
    if (response.status == 200) {
      const json = JSON.parse(
        convert.xml2json(response.data, { compact: true, spaces: 4 })
      );
      //   console.log(json);
      const { data } = await axios.get(url, {
        headers: {
          Cookie: json.response.SesInfo._text,
        },
      });
      //Load HTML we fetched in the previous line
      const $ = cheerio.load(data);
      //Select all the list items in plainlist class
      const element = $("rsrp");
      const string = element.text().slice(1);
      const number = parseInt(string);
      console.log(number);
    }
  } catch (err) {
    console.error(err);
  }
  setTimeout(scrapeData, 5000);
}
// Invoke the above function
scrapeData();

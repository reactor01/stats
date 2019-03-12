const RandomHttpUserAgent = require('random-http-useragent');
const axios = require('axios-https-proxy-fix');
const cheerio = require('cheerio');
const fs = require('fs');
const chalk = require('chalk');
let U = require('./randomProxy/randomProxy');
const lineReader = require('line-reader');



let arr = [];
let randomHost = '';
let randomPort;

const url = 'https://www.iplocation.net/'
const outputFile = 'data.json'
const parsedResults = []
const pageLimit = 10
let pageCounter = 0
let resultCount = 0
let randomProxy = [];

console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

const getWebsiteContent = async (url, userAgent, randomHost, randomPort) => {
  try {
    let proxy = {
        host: randomHost,
        port: parseInt(randomPort),
        auth: {
          username: '',
          password: ''
        }
      };
    axios.defaults.headers.common['User-Agent'] = userAgent;
    axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8'; // for all requests
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; // for all requests
    // setTimeout(() => init(), 4000)
    const response = await axios.get(url, {proxy});
    // console.log(response);
    // setTimeout((response) => {
    //     if(response === undefined) {
    //       init();
    // }
    // }, 3000)
    const $ = cheerio.load(response.data);
    const count = resultCount++
    // console.log(response);
    // let title = $('.table').text();
    // let title = $('title').text();
    // let title = $('.list-group list-group-item').text();
    let title = $('.col .col_6_of_12').text()
    
    const metadata = {
      count: count,
      title: title
    }
    parsedResults.push(metadata);
    console.log(parsedResults);
    
    exportResults(parsedResults)

  } catch (error) {

    exportResults(parsedResults)
    console.error(error)
    init();
  }
}

const exportResults = (parsedResults) => {
  fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
    if (err) {
      console.log(err)
    }
    console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
  })
}



function returnRandomProxy() {
  lineReader.eachLine('./randomProxy/proxyList.txt', function(line, last) {
    // do whatever you want with line...
    newLine = line.replace(/'/g, "");
    newLine2 = newLine.replace(/,/g, "");
  
    arr.push.apply(arr, [newLine2]);
    
    if(last){
      // or check if it's the last one

      randomProxy = arr[Math.floor(Math.random()*arr.length)];
      let hostPortSplitArray = randomProxy.split(':');
      randomHost = hostPortSplitArray[0];
      randomPort = hostPortSplitArray[1];
      console.log(randomHost);
      console.log(randomPort);

      console.log('1');
      startRequest(randomHost, randomPort);

    }
  });
  
  console.log('2');
  return randomProxy;
}

function startRequest(randomHost, randomPort) {
  RandomHttpUserAgent.get()
    .then((userAgent) => {
      console.log('3');
      getWebsiteContent(url, userAgent, randomHost, randomPort)
      
})
.catch((error) => console.error(error.message))
}


async function init() {
  await returnRandomProxy();

  console.log('4');
}

init();


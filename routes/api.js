const express = require('express');

const router = express.Router();
const chalk = require('chalk');
const RandomHttpUserAgent = require('random-http-useragent');
const axios = require('axios-https-proxy-fix');
const cheerio = require('cheerio');
const fs = require('fs');
const lineReader = require('line-reader');

let arr = [];
let randomHost = '';
let randomPort;

const url = 'https://topbg.net';
const outputFile = 'data.json';
const parsedResults = [];
let randomProxy = [];


console.log(chalk.yellow.bgBlue(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`))

router.get('/', (req, res) => {

    const getWebsiteContent = async (url, userAgent, randomHost, randomPort) => {
        try {
          console.log(`Proxy: ${randomHost}:${randomPort} \nUser-Agent: ${userAgent}`);
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
          axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; 
          
          const response = await axios.get(url, {proxy});
          console.log('Loading...');
          const $ = cheerio.load(response.data);
          let dataObj = $('footer p.m-0').text()
        
          const metadata = {
            dataObj: dataObj
          }
          
          parsedResults.push(metadata);
          exportResults(parsedResults)
          
          res.send(metadata);
          
         } catch (error) {
          console.error(error);
          exportResults(parsedResults)
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
      
      const returnRandomProxy = () => {
        lineReader.eachLine('./getData/randomProxy/proxyList.txt', function(line, last) {
          
          newLine = line.replace(/'/g, "");
          newLine2 = newLine.replace(/,/g, "");
        
          arr.push.apply(arr, [newLine2]);
          
          if(last){
            randomProxy = arr[Math.floor(Math.random()*arr.length)];
            let hostPortSplitArray = randomProxy.split(':');
            randomHost = hostPortSplitArray[0];
            randomPort = hostPortSplitArray[1];
        
            startRequest(randomHost, randomPort);
          }
        });
      }
      
      const startRequest = (randomHost, randomPort) => {
        RandomHttpUserAgent.get()
          .then((userAgent) => {
            getWebsiteContent(url, userAgent, randomHost, randomPort)  
      })
      .catch((error) => console.error(error.message))
      }
      
      
      const init = async () => {
        await returnRandomProxy();
      }
      init();
  })

module.exports = router;
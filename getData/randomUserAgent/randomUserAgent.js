const RandomHttpUserAgent = require('random-http-useragent')


const randomUserAgent = () => {

    RandomHttpUserAgent.get()
        .then((userAgent) => userAgent)
        .catch((error) => console.error(error.message))

}

module.exports = randomUserAgent;

// function partA() {
//     console.log('partA');
//     setTimeout(partB, 5000);
//   }
  
//   function partB() {
//     console.log('partB');
//     console.log(userAgentCheck);
  
//     axios.defaults.headers.common['User-Agent'] = userAgentCheck // for all requests
//     axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8' // for all requests
//     axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*' // for all requests
//     // getWebsiteContent(url)
//   }
const app = require('express')();

const apiRoute = require('./routes/api');


// app.get('/:id', function(req, res) {
//   //  res.send(req.params.id);
//   //  res.send(req.url);
//   //  console.log(req.url);
//   });

app.use(apiRoute);

// app.use('/', function(req, res) {
//   res.send('<h1>Home</h1>')
//   });

const port = process.env.PORT || 5008;

app.listen(port, () => console.log(`Server running on port ${port}`));
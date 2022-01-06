const apiRoutes = require('./routes/apiRoutes')
const htmlRoutes = require('./routes/htmlRoutes');

const express = require('express');
// const fs = require('fs');
// const path = require('path'); 

// // require the data from the JSON
// const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// set up Express.js middleware that instructs the server to make certain 
// files readily available and to not gate it behind server endpoint
// we will use this for our CSS and HTML
// we provide a file path to a location in our application and instruct
// the server to make these files static resources.
// This means that all of our front-end code can now be accessed without 
// having a specific server endpoint created for it.
app.use(express.static('public'));

// this concats /api before the routes in the apiRoutes folder
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);





// tell the server to listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
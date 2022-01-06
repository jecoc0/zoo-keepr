const express = require('express');
const fs = require('fs');
const path = require('path'); 

// require the data from the JSON
const { animals } = require('./data/animals');

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


// handle filtering in a separate function -- 
// method built into Express.js that converts POST data to key/value pairings
function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  //note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // save personality traits as a dedicated array.
    // if personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array
    personalityTraitsArray.forEach(trait => {
      // check the trait against each animal in the filteredResults array
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  return filteredResults;
}

// function that takes the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}


// this function accepts the POST route's req.body AND the array we want to add the data to (animalsArray)
function createNewAnimal(body,animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  // write the new animal to the JSON - this is the syncronous version of fs.writeFile
  // this version does not require a callback function
  // we can use this because the file is small, if it were bigger it would be better to use
  // the version we used previously which was fs.writeFile
  fs.writeFileSync(
    // we want to write the animals.json to the data subdirectory, push.join() allows us to join the value
    // of __dirname (this representsthe directory of the file we execute the code in) with
    // the path to the animals.json file
    path.join(__dirname, './data/animals.json'),
    // save the JavaScript array data as JSON using JSON.stringify to convert it
    // null means we don't want to edit any of our existing data, if we did, we could pass something in
    // 2 indicates we want to create white space between our values to make it more readable.
    // the file would still be functional without these arguments, but much harder to read.
    JSON.stringify({ animals: animalsArray }, null, 2)
  );
  // return finished code to post route for response
  return animal;
}

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
  return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

// add the route - get requires two arguments 
// 1. a string describing the route the client will fetch from
// 2. a callback function that will execute every time that the route is accessed with a GET request
// the .json method on the res parameter sends the string to the client
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    // filterByQuery needs two parameters, req.query and the existing animals results array.
    // The two need to be checked against each other to see if we have an animal in the results array
    // that fits the restrictions dictated by the query (in req.query)
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// GET route for animals for one specific animal wanted 
// param routes must come AFTER other GET routes.
// end of URL and param.___ need to match
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result){
    res.json(result);
  } else {
    // this error lets the user know it is a user error, not a server error
    res.send(404);
  }
});

// define a route that listens for POST requests - client requesting the server to accept data
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
     // this error lets the user know it is a user error, not a server error
    res.status(400).send('The animal is not properly formatted.');
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
  }
});

// the / route points us to the route of the server so we can create a homepage for our server.
// this GET route has only one job to do, and that is to respond with an html
// page to display in the browser so we are using res.sendFile() instead of res.json()
// all we need to do is tell them where to find the file we want the server to read and send
// back to the client.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// routes beginning with api/animals should transfer JSON data
// normal looking endpoints such as /animals should serve an HTML page
// this routes and serves up animals.html
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'))
});
// this routes and serves up zookeepers.html
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});
// * acts as a wildcard, any route that wasn't previously definted will be handled by this route
// the * route should always come last, otherwise, it will take precedence over named routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
});

// tell the server to listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
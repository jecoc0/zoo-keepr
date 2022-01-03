const express = require('express');

// require the data from the JSON
const { animals } = require('./data/animals');

const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// handle filtering in a separate function
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
      // check the trait against each animal in the filteredREsults array
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


// add the route - get requires two arguments 
// 1. a string describing the route the client will fetch from
// 2. a callback function that will execute every time that the route is accessed with a GET request
// the .send method on the res parameter sends the string to the client
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

// GET route for animals for one specific animal wanted 
// param routes must come AFTER other GET routes.
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result){
    res.json(result);
  } else {
    res.send(404);
  }
});

// tell the server to listen for requests
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
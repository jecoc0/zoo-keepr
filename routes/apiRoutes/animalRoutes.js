// cannot use app because it is definted by server.js and cannot be accessed here.
// Instead, we will use router which allows you to declare routes in any file as long 
// as you use the proper middleware.
const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
// require the data from the JSON
const { animals } = require('../../data/animals');

// REMOVE API from all ROUTES due to new location
//================================================
// add the route - get requires two arguments 
// 1. a string describing the route the client will fetch from
// 2. a callback function that will execute every time that the route is accessed with a GET request
// the .json method on the res parameter sends the string to the client
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result){
    res.json(result);
  } else {
    // this error lets the user know it is a user error, not a server error
    res.send(404);
  }
});

// define a route that listens for POST requests - client requesting the server to accept data
router.post('/animals', (req, res) => {
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

module.exports = router;
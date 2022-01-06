const path = require('path');
const router = require('express').Router();

//Because these routes are not initiated in the same file where express
// is first initiated, we must change all instances of app to router
// =====================================================================================
// Because this file is outside two levels, we need to update the file path 
// to ../../public/____.html
// =====================================================================================
// the / route points us to the route of the server so we can create a homepage for our server.
// this GET route has only one job to do, and that is to respond with an html
// page to display in the browser so we are using res.sendFile() instead of res.json()
// all we need to do is tell them where to find the file we want the server to read and send
// back to the client.
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// routes beginning with api/animals should transfer JSON data
// normal looking endpoints such as /animals should serve an HTML page
// this routes and serves up animals.html
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// this routes and serves up zookeepers.html
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// * acts as a wildcard, any route that wasn't previously definted will be handled by this route
// the * route should always come last, otherwise, it will take precedence over named routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;
const router = require('express').Router();
const animalRoutes = require('./animalRoutes');


// we are employing Router as we did in routes/htmlRoutes/index.js
// but this time the module is being exported from animalRoutes.js
router.use(animalRoutes);
router.use(require('./zookeeperRoutes'));

module.exports = router;


// we will use this file as the central hub for all routing functions
// we may want to add to the application in the future.
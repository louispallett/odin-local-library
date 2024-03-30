const express = require('express');
const router = express.Router();

/* GET home page. */
// Since we want our home page to be our 'catalog', we can redirect the response to go to
// our catalog page:
router.get('/', function(req, res) {
  res.redirect("/catalog");
});

module.exports = router;

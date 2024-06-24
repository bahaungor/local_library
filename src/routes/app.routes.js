// CREATE EXPRESS ROUTER
const express = require('express');

const router = express.Router();

// IMPORT CONTROLLER MODULES
const book_controller = require('../controllers/book.controller');

// CREATE ROUTES TO CALL CERTAIN CONTROLLER FUNCTIONS ON CERTAIN REQUESTS
router.get('/counts', book_controller.counts);

// EXPORT ROUTER
module.exports = router;

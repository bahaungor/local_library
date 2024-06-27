// CREATE EXPRESS ROUTER
const express = require('express');

const router = express.Router();

// IMPORT CONTROLLER MODULES
const book_controller = require('../controllers/book.controller');
const author_controller = require("../controllers/author.controller");
const genre_controller = require("../controllers/genre.controller");
const instance_controller = require("../controllers/instance.controller");

// CREATE ROUTES TO CALL CERTAIN CONTROLLER FUNCTIONS ON CERTAIN REQUESTS
router.get('/counts', book_controller.counts);
router.get('/booklist', book_controller.book_list);
router.get("/book/create", book_controller.create_get); // BEFORE ID ROUTE !!
router.post("/book/create", book_controller.create_post); // BEFORE ID ROUTE !!
router.get("/book/:ID", book_controller.book_detail);
router.delete('/book/:ID', book_controller.book_delete);
router.get("/authorlist", author_controller.author_list);
router.get("/author/create", author_controller.create_get); // BEFORE ID ROUTE !!
router.post("/author/create", author_controller.create_post); // BEFORE ID ROUTE !!
router.get("/author/:authorID", author_controller.author_detail);
router.delete('/author/:authorID', author_controller.author_delete);
router.get("/genrelist", genre_controller.genre_list);
router.get("/genre/:genreID", genre_controller.genre_detail);
router.get("/genre/create", genre_controller.create_get); // BEFORE ID ROUTE !!
router.post("/genre/create", genre_controller.create_post); // BEFORE ID ROUTE !!
router.delete('/genre/:genreID', genre_controller.genre_delete);
router.get("/instancelist", instance_controller.instance_list);
router.get("/instance/create", instance_controller.create_get); // BEFORE ID ROUTE !!
router.post("/instance/create", instance_controller.create_post); // BEFORE ID ROUTE !!
router.get("/instance/:ID", instance_controller.instance_detail);
router.delete("/instance/:ID", instance_controller.instance_delete);


// EXPORT ROUTER
module.exports = router;

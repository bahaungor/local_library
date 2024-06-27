// IMPORT MODELS YOU NEED DATABASE INTERACTIONS
const Book = require("../models/book");
const Genre = require("../models/genre");

// IMPORT USEFUL MIDDLEWARES
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.genre_list = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const allGenres = await Genre.find().exec();
  
  // HANDLE WHEN NO RESULT RETURNED
  if (allGenres === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  
  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: "Genre List", genre_list: allGenres });
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.genre_detail = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.genreID).exec(),
    Book.find({ genre: req.params.genreID }, "title summary").exec(),
  ]);

  // HANDLE WHEN NO RESULT RETURNED
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }
  
  // RENDER EJS & SEND FETCHED DATA INSIDE JSON FOR ACCESS IN RENDERED EJS
  res.json({title: "Genre Detail", genre: genre, genre_books: booksInGenre });
});


// DEFINE FUNCTION TO DELETE DOCUMENT(S) WHEN CALLED
exports.genre_delete = asyncHandler(async (req, res, next) => {
  try {

    // Find the author by ID and remove
    const genre = await Genre.findByIdAndDelete(req.params.genreID);

    // If genre is not found, return 404
    if (!genre) {
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    // Return success message
    res.json({ message: 'Genre deleted successfully' });
  } catch (error) {
    next(error);
  }
});


// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.create_get = (req, res, next) => {
  // SEND DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: "Create Genre" });
};


// DEFINE FUNCTION TO PROCESS JSON INSIDE REQUEST & SAVE TO DATABASE
exports.create_post = [

  // VALIDATE & SANITIZE FORM FIELDS (SAME AS MONGOOSE MODEL FIELDS)
  body("name")
    .trim() // Remove leading and trailing whitespaces from text input
    .isLength({ min: 3 }) // Minimum length of 3 characters from text input
    .escape() // HTML escape any dangerous characters from text input
    .not().isEmpty() // Required
    .withMessage("Genre name must be specified."),

  // PROCESS REQUEST AFTER VALIDATION & SANITIZATION
  asyncHandler(async (req, res, next) => {

    // EXTRACT VALIDATION ERRORS FROM REQUEST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // ERROR! RENDER FORM AGAIN WITH SANITIZED VALUES & ERROR MESSAGES
      console.log("there are errors in the form")
      return;
    } else {
      // VALID FORM! CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
      const genre = new Genre({ name: req.body.name });

      // SAVE DOCUMENT TO DB & SEND DOCUMENT INSIDE JSON TO ACCESS IN REACT
      await genre.save();
      res.json({ genre: genre });
    }
  }),
];
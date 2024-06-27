// IMPORT USEFUL MIDDLEWARES
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require("express-validator");

// IMPORT MODELS YOU NEED DATABASE INTERACTIONS
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.counts = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const [numBooks, numBookInstances, numAvailableBookInstances, numAuthors, numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: 'Available' }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({
    title: 'Local Library Home',
    book_count: numBooks,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    author_count: numAuthors,
    genre_count: numGenres,
  });
});

// DEFINE ROUTE TO SEND JSON ON GET REQUEST
exports.book_list = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const allBooks = await Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec();

  // HANDLE WHEN NO RESULT RETURNED
  if (allBooks === null) {
    const err = new Error('Book not found');
    err.status = 404;
    return next(err);
  }

  // SEND FETCHED DATA INSIDE JSON
  res.json({ title: 'Book List', book_list: allBooks });
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.book_detail = asyncHandler(async (req, res, next) => {

  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.ID).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.ID }).exec(),
  ]);

  // HANDLE WHEN NO RESULT RETURNED
  if (book === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: book.title, book: book, book_instances: bookInstances });
});


// DEFINE FUNCTION DELETE DOCUMENT(S) WHEN CALLED
exports.book_delete = asyncHandler(async (req, res, next) => {
  try {
    // Find the author by ID and remove
    const book = await Book.findByIdAndDelete(req.params.ID );

    // If book is not found, return 404
    if (!book) {
      const err = new Error("Book not found");
      err.status = 404;
      return next(err);
    }

    // Delete the book instances as well
    const instances = await BookInstance.deleteMany({ book: req.params.ID });

    // Return success message
    res.json({ message: 'Book & instances deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.create_get = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const [allAuthors, allGenres] = await Promise.all([
    Author.find().exec(),
    Genre.find().exec(),
  ]);

  // SEND DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({title: "Create Book", authors: allAuthors, genres: allGenres});
});


// DEFINE FUNCTION TO PROCESS JSON INSIDE REQUEST & SAVE TO DATABASE
exports.create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // VALIDATE & SANITIZE FORM FIELDS (SAME AS MONGOOSE MODEL FIELDS)
  body("title", "Please enter title").trim().isLength({ min: 1 }).escape(),
  body("author", "Please enter author").trim().isLength({ min: 1 }).escape(),
  body("summary", "Please enter summary").trim().isLength({ min: 1 }).escape(),
  body("isbn", "Please enter ISBN").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),

  // PROCESS REQUEST AFTER VALIDATION & SANITIZATION
  asyncHandler(async (req, res, next) => {

    // EXTRACT VALIDATION ERRORS FROM REQUEST
    const errors = validationResult(req);

    // CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // ERROR!
      console.log("There are errors in the form")
      return;
    } else {
      // VALID FORM! CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
      await book.save();

      // SAVE DOCUMENT TO DB & SEND DOCUMENT INSIDE JSON TO ACCESS IN REACT
      res.json({ book: book });
    }
  }),
];
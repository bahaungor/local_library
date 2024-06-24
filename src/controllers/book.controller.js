// IMPORT USEFUL MIDDLEWARES
const asyncHandler = require('express-async-handler');

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

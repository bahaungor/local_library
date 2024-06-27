// IMPORT MODELS YOU NEED DATABASE INTERACTIONS
const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");

// IMPORT USEFUL MIDDLEWARES
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.instance_list = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const allBookInstances = await BookInstance.find().populate("book").exec();
  
  // HANDLE WHEN NO RESULT RETURNED
  if (allBookInstances === null) {
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: "Book Instance List", bookinstance_list: allBookInstances });
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.instance_detail = asyncHandler(async (req, res, next) => {
    // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
    const bookInstance = await BookInstance.findById(req.params.ID)
      .populate("book")
      .exec();

    // HANDLE WHEN NO RESULT RETURNED
    if (bookInstance === null) {
      const err = new Error("Book copy not found");
      err.status = 404;
      return next(err);
    }

    // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
    res.json({ title: "Book:", bookinstance: bookInstance });
});


// DEFINE FUNCTION TO DELETE DOCUMENT(S) WHEN CALLED
exports.instance_delete = asyncHandler(async (req, res, next) => {
  try {
    // Find the author by ID and remove
    const instance = await BookInstance.findByIdAndDelete(req.params.ID);

    // If author is not found, return 404
    if (!instance) {
      const err = new Error("Instance not found");
      err.status = 404;
      return next(err);
    }

    // Return success message
    res.json({ message: 'Book instance deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.create_get = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const allBooks = await Book.find({}, "title").exec();

   // SEND DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({title: "Create BookInstance", book_list: allBooks });
});

// DEFINE FUNCTION TO PROCESS JSON INSIDE REQUEST & SAVE TO DATABASE
exports.create_post = [
  // VALIDATE & SANITIZE FORM FIELDS
  body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }).escape(),
  body("due_back", "Invalid date").optional({ values: "falsy" }).isISO8601().toDate(),
  body("status").escape(),

  // PROCESS REQUEST AFTER VALIDATION & SANITIZATION
  asyncHandler(async (req, res, next) => {

    // EXTRACT VALIDATION ERRORS FROM REQUEST
    const errors = validationResult(req);

    // CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      due_back: req.body.due_back,
      status: req.body.status,
    });
    
    if (!errors.isEmpty()) {
      // ERROR!
      console.log("There are errors in the form")
      return;
    } else {
      // VALID FORM! CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
      await bookInstance.save();
      // SAVE DOCUMENT TO DB & SEND DOCUMENT INSIDE JSON TO ACCESS IN REACT
      res.json({instance: bookInstance})
    }
  }),
];
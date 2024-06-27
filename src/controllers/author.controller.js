// IMPORT MODELS YOU NEED DATABASE INTERACTIONS & ASYNC MIDDLEWARE
const Book = require("../models/book");
const Author = require("../models/author");

// IMPORT USEFUL MIDDLEWARES
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.author_list = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  // HANDLE WHEN NO RESULT RETURNED
  if (allAuthors === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: "Author List", author_list: allAuthors });
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.author_detail = asyncHandler(async (req, res, next) => {
  // FETCH DATA FROM DB (MULTIPLE DATA → FETCH IN PARALLEL VIA PROMISE.ALL)
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.authorID).exec(),
    Book.find({ author: req.params.authorID }, "title summary").exec(),
  ]);

  // HANDLE WHEN NO RESULT RETURNED
  if (author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  // SEND FETCHED DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({title: "Author Detail", author: author, author_books: allBooksByAuthor});
});


// DEFINE FUNCTION TO DELETE DOCUMENT(S) WHEN CALLED
exports.author_delete = asyncHandler(async (req, res, next) => {
  try {
    // Find the author by ID and remove
    const author = await Author.findByIdAndDelete(req.params.authorID);

    // If author is not found, return 404
    if (!author) {
      const err = new Error("Author not found");
      err.status = 404;
      return next(err);
    }

    // Remove associated books
    await Book.deleteMany({ author: req.params.authorID});

    // Return success message
    res.json({ message: 'Author and associated books deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DEFINE FUNCTION TO FETCH DATA & SEND INSIDE JSON WHEN CALLED
exports.create_get = (req, res, next) => {
  // SEND DATA INSIDE JSON TO ACCESS INSIDE REACT
  res.json({ title: "Create Author" });
};

// DEFINE FUNCTION TO PROCESS JSON INSIDE REQUEST & SAVE TO DATABASE
exports.create_post = [
  // VALIDATE & SANITIZE FORM FIELDS
  body("first_name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // PROCESS REQUEST AFTER VALIDATION & SANITIZATION
  asyncHandler(async (req, res, next) => {

    // EXTRACT VALIDATION ERRORS FROM REQUEST
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // ERROR!
      console.log("there are errors in the form")
      return;
    } else {
      // VALID FORM! CREATE NEW DOCUMENT WITH ESCAPED & TRIMMED DATA
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });

      // SAVE DOCUMENT TO DB & SEND DOCUMENT INSIDE JSON TO ACCESS IN REACT
      await author.save();
      res.json({ author: author });
    }
  }),
];
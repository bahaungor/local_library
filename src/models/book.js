// IMPORT MONGOOSE
const mongoose = require('mongoose');

// DEFINE DOCUMENT SCHEMA
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
});

// DEFINE VIRTUAL FOR DOCUMENT SCHEMA
BookSchema.virtual('url').get(function () {
  return `/book/${this._id}`;
});

// TO ACCESS VIRTUALS FROM REACT APP
BookSchema.set('toJSON', {
  virtuals: true,
});

// CREATE Book MODEL TO INTERACT WITH "books" COLLECTION IN DATABASE
module.exports = mongoose.model('Book', BookSchema);

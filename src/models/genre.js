// IMPORT MONGOOSE
const mongoose = require('mongoose');

// DEFINE DOCUMENT SCHEMA
const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// DEFINE VIRTUAL FOR DOCUMENT SCHEMA
GenreSchema.virtual('url').get(function () {
  return `/genre/${this._id}`;
});

// TO ACCESS VIRTUALS FROM REACT APP
GenreSchema.set('toJSON', {
  virtuals: true,
});

// CREATE Genre MODEL TO INTERACT WITH "genres" COLLECTION IN DATABASE
module.exports = mongoose.model('Genre', GenreSchema);

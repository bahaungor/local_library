// IMPORT MONGOOSE
const mongoose = require('mongoose');

// DEFINE DOCUMENT SCHEMA
const AuthorSchema = new mongoose.Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// DEFINE VIRTUAL FOR DOCUMENT SCHEMA
AuthorSchema.virtual('name').get(function () {
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  return fullname;
});

// DEFINE VIRTUAL FOR DOCUMENT SCHEMA
AuthorSchema.virtual('url').get(function () {
  return `/author/${this._id}`;
});

// TO ACCESS VIRTUALS FROM REACT APP
AuthorSchema.set('toJSON', {
  virtuals: true,
});

// CREATE Author MODEL TO INTERACT WITH "authors" COLLECTION IN DATABASE
module.exports = mongoose.model('Author', AuthorSchema);

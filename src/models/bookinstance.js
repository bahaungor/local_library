// IMPORT MONGOOSE
const mongoose = require('mongoose');

// DEFINE DOCUMENT SCHEMA
const BookInstanceSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

// DEFINE VIRTUAL FOR DOCUMENT SCHEMA
BookInstanceSchema.virtual('url').get(function () {
  return `/instance/${this._id}`;
});

// TO ACCESS VIRTUALS FROM REACT APP
BookInstanceSchema.set('toJSON', {
  virtuals: true,
});

// CREATE BookInstance MODEL TO INTERACT WITH "bookinstances" COLLECTION IN DATABASE
module.exports = mongoose.model('BookInstance', BookInstanceSchema);

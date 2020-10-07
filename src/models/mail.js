const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: false,
    default: '',
  },

  message: {
    type: String,
    required: false,
    default: '',
  },

});

const MailModel = mongoose.model('Mail', Schema);

module.exports = MailModel;

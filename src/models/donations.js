const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DonationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  cause: {
    type: Schema.Types.ObjectId,
    ref: 'cause',
  },
  amount: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 1) {
        throw new Error({ errMessage: 'Donation amount must be atleast 1' });
      }
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
  },
});
const Donation = mongoose.model('donation', DonationSchema);
module.exports = Donation;

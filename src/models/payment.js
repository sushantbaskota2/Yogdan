const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  idx: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  contact: {
    type: String
  },
  product_identity: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    ref: "cause"
  },
  donator: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },

  date: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model("payment", paymentSchema);
module.exports = Payment;

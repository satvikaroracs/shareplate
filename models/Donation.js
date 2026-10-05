const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    foodItem: { type: String, required: true },
    quantity: { type: String, required: true },
    expiryTime: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Picked Up'],
      default: 'Available'
    },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);

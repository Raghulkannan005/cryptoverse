import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coins: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field before saving
watchlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
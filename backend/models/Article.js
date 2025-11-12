const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ArticleSchema= new Schema({
    user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  urlToImage: {
    type: String
  },
  summary: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    default: 'Neutral'
  },
  publishedAt: {
    type: Date,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  },
  summarizedAt: {
    type: Date,
    default: Date.now
  }
});

// To prevent a user from saving the same article multiple times
ArticleSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = Article = mongoose.model('Article', ArticleSchema);



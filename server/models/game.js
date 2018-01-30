const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const GameSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{
  timestamps: true
});

module.exports = mongoose.model('Game', GameSchema);

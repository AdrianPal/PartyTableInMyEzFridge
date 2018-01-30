// Importing Node packages required for schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
  name: { type: String },
  pos: { type: String },
  avatarPath: { type: String },
  color: { type: String },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
},
  {
    timestamps: true
  });

module.exports = mongoose.model('User', UserSchema);

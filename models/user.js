var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');
var UserSchema = new Schema({
userid:         { type: String },
password:       { type: String },
email:          { type: String },
lastAccess: {type:Date,default: Date.now},
visits: {type: Number, default:0},
timestamp:      { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('user', UserSchema);

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    path = require('path');
var UserSchema = new Schema({
userid:          {type: String },
timerid:         { type: String },
hour:            { type: Number },
minute:          { type: Number },
second:          {type: Number},
start:           {type: Boolean},
timestamp:       { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('timer', UserSchema);

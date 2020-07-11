const mongoose = require("mongoose");
var date = new Date();
var tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  start_time: {
    type: Number,
    default: date.getTime(),
  },
  waiting: {
    type: Boolean,
    default: false,
  },
  ordered: {
    type: Boolean,
    default: false,
  },
  eating: {
    type: Boolean,
    default: false,
  },
  empty: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("table", tableSchema);

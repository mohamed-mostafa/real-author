const mongoose = require("mongoose");
const { Schema } = mongoose;
const historySchema = new Schema({
  record: { type: String },
});

module.exports = mongoose.model("History", historySchema);

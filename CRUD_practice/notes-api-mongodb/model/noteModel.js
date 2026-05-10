const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, //must have title
    },
  },
  {
    timestamps: true, //auto add createat and updateAt
  },
);

module.exports = mongoose.model("Note", noteSchema);

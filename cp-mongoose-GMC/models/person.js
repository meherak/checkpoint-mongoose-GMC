const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    max: 100,
  },
  favoriteFoods: [String],
  //   email: {
  //     type: String,
  //     unique: true,
  //     lowercase: true,
  //   },
});
module.exports = Person = mongoose.model("Person", personSchema);

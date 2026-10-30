const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number },
  calories: { type: Number, required: true },
  suggestStatus: { type: String, required: true },
},{timestamps:true})

const Food = mongoose.model('Food', foodSchema)

module.exports = Food
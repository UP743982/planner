var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ProductSchema = new Schema({
    category: String,
    name: String,
    price: Number,
    cover: String
})

let Planner = mongoose.model('Planner', {
    type: String,
    leader: String,
    topics: String,
    notes: String,
    assessment: String,
    resources: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema)
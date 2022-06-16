const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const DaySchema = new Schema({
    
    email: {
        type: String,
    },
    dayName: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    importance: {
        type: String,
        maxlength: 30
    },
    date: {
        type: String,
    }
    
}, {collection: 'days', timestamps: true })

const Day = mongoose.model('Day', DaySchema)

module.exports = Day; 
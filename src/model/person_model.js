const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const PersonSchema = new Schema({
    
    personName: {
        type: String,
        required: [true, "Ad alanı boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    phone: {
        type: Number,
        required: [true, "Telefon alanı boş olamaz"],
        trim:true,
        minlength: 11,
        maxlength: 11
    },
    other: {
        type: String,
    }
    

}, {collection: 'persons', timestamps: true })

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person;
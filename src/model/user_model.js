const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    
    firstName: {
        type: String,
        required: [true, "Ad alanı boş olamaz"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: [true, "Soyad alanı boş olamaz"],
        trim:true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    emailActive: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
    

}, {collection: 'users', timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User;
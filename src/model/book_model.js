const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const BookSchema = new Schema({
    
    email: {
        type: String,
    },
    bookName: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    writerName: {
        type: String,
        maxlength: 30
    },
    genre: {
        type: String,
        maxlength: 30
    }
    
}, {collection: 'books', timestamps: true })

const Book = mongoose.model('Book', BookSchema)

module.exports = Book; 
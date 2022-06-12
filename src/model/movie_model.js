const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const MovieSchema = new Schema({
    
    createdAt: {
        type: String,
    },
    movieName: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    directorName: {
        type: String,
        maxlength: 30
    },
    kind: {
        type: String,
        maxlength: 30
    }
    
}, {collection: 'movies', timestamps: true })

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie; 
const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const AnythingSchema = new Schema({
    
    createdAt: {
        type: String,
    },
    anythingName: {
        type: String
    },
    anything: {
        type: String,
    },
    date: {
        type: String
    }
    
}, {collection: 'anythings', timestamps: true })

const Anything = mongoose.model('Anything', AnythingSchema)

module.exports = Anything; 
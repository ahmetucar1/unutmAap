const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const OfferSchema = new Schema({
    
    email: {
        type: String,
    },
    email: {
        type: String,
    },
    offer: {
        type: String
    }
    
}, {collection: 'offer', timestamps: true })

const Offer = mongoose.model('Offer', OfferSchema)

module.exports = Offer; 
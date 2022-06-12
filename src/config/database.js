const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}) 
    .then(() => console.log('Connected to database'))
    .catch(error => console.log(`Database connection error ${error}`));
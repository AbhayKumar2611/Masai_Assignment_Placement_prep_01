const mongoose = require('mongoose')
require('dotenv').config()

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Mongo DB Connected Successfully")
    }).catch((error) => {
        console.log("Error in Connecting to MongoDB", error)
    })
}

module.exports = connectToDB
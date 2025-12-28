const mongoose = require("mongoose")
require('dotenv').config()

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("MongoDB Connected Successfully")
    }).catch((error) => {
        console.log("Error in connecting mongodb")
    })
}

module.exports = connectToDB;
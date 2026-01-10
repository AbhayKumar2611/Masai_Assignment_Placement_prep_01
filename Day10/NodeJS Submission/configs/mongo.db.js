const mongoose = require("mongoose")
require('dotenv').config()

const connectToDB = () => {
    mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/productCatalog").then(() => {
        console.log("MongoDB Connected Successfully")
    }).catch((error) => {
        console.log("Error in connecting mongodb:", error.message)
    })
}

module.exports = connectToDB;


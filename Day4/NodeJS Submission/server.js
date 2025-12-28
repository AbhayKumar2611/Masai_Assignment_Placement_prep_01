const express = require('express')
const connectToDB = require('./configs/mongo.db')

const app = express()
app.use(express.json())

// MongoDB Connection
connectToDB()

app.get('/test', (req, res) => {
    res.status(200).json({message: "This is test route"})
})

app.use((req, res) => {
    res.status(400).json({message: "This route is not defined"})
})

app.use("/users", UserRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`)
})
const express = require('express')
const connectToDB = require('./configs/mongo.db')
const UserRouter = require('./routes/user.routes')
const TaskRouter = require('./routes/task.routes')
require('dotenv').config()

const app = express()
app.use(express.json())

connectToDB()

// handling test route
app.get("/test", (req, res) => {
    res.status(200).json({msg:"This is a test route"})
})

app.use("/users", UserRouter)
app.use("/tasks", TaskRouter)

// Handling undefined routes
app.use((req, res) => {
    res.status(404).json({msg:"This route doen not exist"})
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`)
})
const express = require('express')
const connectToDB = require('./configs/mongo.db')
const UserRouter = require('./routes/users.router')

const app = express()

// Middleware
app.use(express.json())

// MongoDB Connection
connectToDB()

// Test route
app.get('/test', (req, res) => {
    res.status(200).json({ message: "This is test route" })
})

// User routes (includes signup, login, and protected routes)
app.use("/users", UserRouter)

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).json({ message: "This route is not defined" })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`)
})

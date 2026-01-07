const mongoose = require('mongoose')

const TaskSchema = mongoose.Schema({
    title: {type:String, required:true},
    description: {type:String, required:true},
    status: {type:String, enum:["in-progress", "todo", "completed"], required:true},
    priority: {type:String, required:true},
    createdBy: {type: Object, ref:"Users"}
})

const TaskModel = mongoose.model("Tasks", TaskSchema)

module.exports = TaskModel
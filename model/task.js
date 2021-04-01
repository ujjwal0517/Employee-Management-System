const express = require('express');
const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    task:{
        type: String,
        required: false,
    },
    assigned:{
        type: String, 
        required: false,
    },
});
module.exports = mongoose.model("Task",taskSchema)
const mongoose = require('mongoose');
const express = require('express');
 const userSchema = new mongoose.Schema({
     name: {
         type: String, 
         required: false
     }, 
     email:{
         type: String, 
         required: false
     }, 
     password:{
         type: String, 
         required: false
     }, 
    
     date:{
         type: Date, 
         default: Date.now  
     }
 })
 const User = mongoose.model("User", userSchema);
 module.exports = User;
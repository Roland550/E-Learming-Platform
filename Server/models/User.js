const express = require('express'); 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    password: String,
    role: String
})
const User = mongoose.model('User', UserSchema);
module.exports = User;
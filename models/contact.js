const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please provide your full name']
    },
    email: {
        type: String,
        required: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          ' Please provide a valid email'],
    },

    message : {
        type : String,
        required : [true, 'Message cannot be blank!']
    }
},{timestamps: true})

module.exports = mongoose.model('Contact', contactSchema)
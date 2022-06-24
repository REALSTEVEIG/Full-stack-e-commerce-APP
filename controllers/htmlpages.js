const jwt = require('jsonwebtoken')
const Contact = require('../models/contact')

const nodemailer = require('nodemailer')
//Begining of Oauth configuration
const { google } = require('googleapis')
const config = require('../config')
const { StatusCodes } = require('http-status-codes')
const OAuth2 = google.auth.OAuth2

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret)
OAuth2_client.setCredentials({refresh_token : config.refreshToken})
//End of Oauth2 configuration

exports.index = async (req, res) => {
    const token = req.cookies.token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return res.render('index', {name : payload.username})
    } catch (error) {
       // console.log(error)
    }
    
}

exports.about = (req, res) => {
    res.render('about')
}

exports.contact = (req, res) => {
    res.render('contact')
}

exports.contactSend = (req, res) => {
    const output = `
        <h1>You have a new contact request</h1>
        <h3>Contact Details</h3>
        <ul>
            <li>Name : ${req.body.name}</li>
            <li>Email : ${req.body.email}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `

    const data =  Contact.create({...req.body}) //this will send the clients message and information to my database for future refrences

    const accessToken = OAuth2_client.getAccessToken
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            type : 'OAuth2',
            user : config.user,
            clientId : config.clientId,
            clientSecret : config.clientSecret,
            refreshToken : config.refreshToken,
            accessToken : accessToken
        }
    })

    let mailOptions = {
        from : `AGU Nigeria<${config.user}>`, // sender address
        to: `<${req.body.email}>`, // list of receivers   
        subject : 'Greetings!', // Subject line
        text : `Hello ${req.body.name}. Thank you for contacting Agu Nigeria. We have received your message and will get back to you as soon as possible!`     
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        return res.render('contact', {msg:'Your message has been sent successfully. Please check your email!'});
    });

    let mailOptions2 = {        // This will send the mail to your email address
        from : `FROM STEPHEN <${config.user}>`, // sender address
        to: `<${config.user}>`, // list of receivers
        subject: `Message from ${req.body.name}!`, // Subject line
        html: output // html body
    };

    transporter.sendMail(mailOptions2, (error, info) => {
        if (error) {
            return console.log(error);
        }
       return console.log('Sent')
    });
}

exports.product = (req, res) => {
    res.render('product')
}

exports.testimonial = (req, res) => {
    res.render('testimonial')
}

exports.blog_list = (req, res) => {
    res.render('blog_list')
}



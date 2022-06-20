const Auth = require('../models/auth')
const {StatusCodes} = require('http-status-codes')

exports.registerPage = async (req, res) => {
   res.render('register')
}

exports.registerUser = async (req, res) => {
   const newUser = await Auth.create({...req.body})
   const token = newUser.createJWT()
   if (newUser) {
    res.cookie('token', token, {
      expires: new Date(Date.now() + 60*60*24*1), // time until expiration
      secure: false, // set to true if you're using https
      httpOnly: true,
    })
    return res.status(StatusCodes.CREATED).redirect('login')
   }  else {
    return res.status(StatusCodes.BAD_REQUEST).render('/')
   }
}

exports.loginPage = async (req, res) => {
   res.render('login')
}

exports.loginUser = async (req, res) => {

  const {email, password} = req.body

  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST).render('login', {msg : `Please provide all the required credentials!`})
  }
 
  const user = await Auth.findOne({email})

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).render('login', {msg : `Email does not exist!`})
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).render('login', {msg : `Password is incorrect!`})
  }

  const token = user.createJWT()
  res.cookie('token', token, {
    expires: new Date(Date.now() + 60*60*24*1), // time until expiration
    secure: false, // set to true if you're using https
    httpOnly: true,
  })
  return res.status(StatusCodes.OK).redirect('product')
}

exports.logout = async (req, res) => {
  await res.cookie('token', "", {
    secure: false, // set to true if you're using https
    httpOnly: true,
  })
  return res.status(StatusCodes.OK).redirect('login')
}

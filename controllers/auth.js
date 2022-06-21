const Auth = require('../models/auth')
const {StatusCodes} = require('http-status-codes')

exports.registerPage = async (req, res) => {
   res.render('register')
}

exports.registerUser = async (req, res) => {
  const {username, email, password} = req.body

  if (!username || !email || !password) {
     res.status(StatusCodes.BAD_REQUEST).render('register', {msg : `Please provide all the required credentials!`})
  } 

  const suppliedEmail = await Auth.findOne({email})

  if (suppliedEmail) {
    return res.status(StatusCodes.BAD_REQUEST).render('register', {msg : `Email already exists in our database. Please provide a different one.`})
  }

  const suppliedUsername = await Auth.findOne({username})

  if (suppliedUsername) {
    return res.status(StatusCodes.BAD_REQUEST).render('register', {msg : `Username already exists in our database. Please provide a different one.`})
  }

  const newUser = await Auth.create({
    username : req.body.username,
    email : req.body.email,
    password : req.body.password
  })
  const token = newUser.createJWT()

  if (newUser) {
    res.cookie('token', token, {
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

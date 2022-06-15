const Auth = require('../models/auth')
const {StatusCodes} = require('http-status-codes')

exports.registerPage = async (req, res) => {
    res.render('register')
}

exports.registerUser = async (req, res) => {
    const newUser = await Auth.create({...req.body})
    const token = newUser.createJWT()
    console.log(newUser, token)
    if (newUser) {
      try {
        const headers = {newUser, token}
        return res.status(StatusCodes.CREATED).render('login', headers)
      } catch (error) {
        console.log(error)
      }
    }
}

exports.loginPage = async (req, res) => {
    res.render('login')
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
   res.status(StatusCodes.BAD_REQUEST).render('login', {msg : `Please provide email and password!`})
  }
  const user = await Auth.findOne({ email })
  if (!user) {
   res.status(StatusCodes.UNAUTHORIZED).render('login', {msg : `Email is incorrect!`})
  }
    // compare password
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).render('login', {msg : `Password is incorrect!`})
  }
    const token = user.createJWT()
    
    if (user) {
      try {
        const headers = {user, token}
        return res.status(StatusCodes.OK).render('product', headers)
      } catch (error) {
        console.log(error)
      }
    }
}

exports.logout = async (req, res) => {
    res.render('login')
}

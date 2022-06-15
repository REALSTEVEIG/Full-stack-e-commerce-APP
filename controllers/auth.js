const Auth = require('../models/auth')
const {BadRequestAPIError, UnauthenticatedAPIError} = require('../errors')
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
        res.status(StatusCodes.CREATED).render('login', headers)
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
    throw new BadRequestAPIError('Please provide email and password')
  }
  const user = await Auth.findOne({ email })
  if (!user) {
    throw new UnauthenticatedAPIError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedAPIError('Invalid Credentials')
  }
  // compare password
    const token = user.createJWT()
    
    if (user) {
      try {
        const headers = {user, token}
        res.status(StatusCodes.OK).render('index', headers)
      } catch (error) {
        console.log(error)
      }
    }
}

exports.logout = async (req, res) => {
    res.render('logout')
}

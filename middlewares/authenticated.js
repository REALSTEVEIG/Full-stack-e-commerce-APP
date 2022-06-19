
const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).render('login')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.username = {userId : payload.userId, username : payload.userername}
        next()        
    } catch (error) {
        return res.status(403).render('/')
    }
   
}
  module.exports = authMiddleware
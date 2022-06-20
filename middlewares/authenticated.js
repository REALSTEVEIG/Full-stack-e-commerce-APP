const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token

    if (!token || token === "") {
        return res.status(401).redirect('login')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.username = {userId : payload.userId, username : payload.userername}
        next()        
    } catch (error) {
        return res.status(403).redirect('/')
    }
   
}
  module.exports = authMiddleware
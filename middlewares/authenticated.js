const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const authMiddleware = async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.FORBIDDEN).redirect('/')
    }

        const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.username = {userId : payload.userId, username : payload.userername}
        return res.status(StatusCodes.OK).redirect('index')
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).redirect('/')
    }
}


module.exports = authMiddleware
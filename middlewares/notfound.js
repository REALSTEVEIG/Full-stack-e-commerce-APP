const {StatusCodes} = require('http-status-codes')
const notfoundMiddleware = async (req, res) => {
    res.status(StatusCodes.NOT_FOUND).end()
}

module.exports = notfoundMiddleware
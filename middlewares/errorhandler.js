const {StatusCodes} = require('http-status-codes')

const errorhandlermiddleware = (err, req, res, next) => {
    const customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || `Trouble with our server, please try again some other time!`
    }

    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors).map((item)=> item.message).join(',')
        customError.statusCode = 400   
    }

    if (err.code && err.code === 11000) {
        customError.msg = `${Object.keys(err.keyValue)} already exists. Please provide another ${Object.keys(err.keyValue)}`
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }
    console.log(err)
    return res.status(customError.statusCode).json({msg : customError.msg})

}

module.exports = errorhandlermiddleware
const jwt = require('jsonwebtoken')

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

exports.product = (req, res) => {
    res.render('product')
}

exports.testimonial = (req, res) => {
    res.render('testimonial')
}

exports.blog_list = (req, res) => {
    res.render('blog_list')
}



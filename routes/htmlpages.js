const express = require('express')

const router = express.Router()

const {index, about, blog_list, contact, product, testimonial} = require('../controllers/htmlpages')

router.route('/index').get(index)
router.route('/about').get(about)
router.route('/blog_list').get(blog_list)
router.route('/contact').get(contact)
router.route('/product').get(product)
router.route('/testimonial').get(testimonial)

module.exports = router
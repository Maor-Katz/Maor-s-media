const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const config = require('config');

// @route POST api/users
// @desc Register user
// @access public
router.post('/register', [
    check('name', 'name required').not().isEmpty(),
    check('email', 'please include valid email').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({min: 6})
], async (req, res) => {
    const {name, email, password} = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
//see if user exsits
        console.log(req.body)
        let user = await User.findOne({email})
        if (user) {
            return res.status(400).json({errors: [{msg: 'user already exists'}]})
        }
//get users gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

//create new user instance
        user = new User({
            name,
            email,
            avatar,
            password
        })

//encrypt passwod
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        }
//return jsonwebtoken
        const token = await jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn: 36000},
            (err, token) => {
                if (err) {
                    throw err
                }
                res.status(200).json({token})
            });

    } catch (e) {
        res.status(500).send(e)
    }

})

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth')
const User = require('../../models/User')
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc Test route
// @access public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({user})
    } catch (e) {
        res.status(500).send(e)
        throw e
    }
})
// @route GET api/auth
// @desc authenticate user and get token
// @access public
router.post('/login', [
    check('email', 'please include valid email').isEmail(),
    check('password', 'password is require').exists()
], async (req, res) => {
    const {email, password} = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
//see if user exsits in our db
        let user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({errors: [{msg: 'user not exists'}]})
        }
// check if password correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({errors: [{msg: 'invalid password'}]})
        }
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
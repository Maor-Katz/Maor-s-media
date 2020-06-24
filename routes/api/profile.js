const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config');
const axios = require('axios');

// @route GET api/profile/me
// @desc Get my profile
// @access private
router.get('/me', auth, async (req, res) => {
    try {
        let profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'no such profile'});
        }
        res.json(profile);
    } catch (e) {
        res.status(500).send(e);
    }
})

// @route POST api/profile
// @desc Create or update user profile
// @access private
router.post('/', [
    auth, [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    const {
        company, website, location, bio, status,
        githubusername, skills, youtube, facebook, twitter,
        instagram, linkedin,
        education
    } = req.body;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    //build social obj
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user: req.user.id});
        if (profile) {
            console.log('i have profile');
            //update profile and return it, in case it exists
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true});
            return res.json(profile);
        }
        //create profile:
        profile = new Profile(profileFields);
        await profile.save();
        console.log('Profile created');
        res.json(profile)
    } catch (e) {
        res.status(500).send('error');
    }
})

// @route GET api/profile/all
// @desc Get all profile
// @access public
router.get('/all', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (e) {
        res.status(500).send(e);
    }
})

// @route GET api/profile/all
// @desc Get specific profile
// @access public
router.get('/user/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({msg: 'profile not found'});
        }
        res.json(profile);
    } catch (e) {
        if (e.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'user id incorrect'});
        }
        res.status(500).send('server error');
    }
})

// @route POST api/delete/:id
// @desc delete profile
// @access private
router.delete('/delete', auth, async (req, res) => {
    try {
        await Profile.findOneAndDelete({user: req.user.id});
        await User.findOneAndDelete({_id: req.user.id});
        res.json({msg: 'user had been deleted'});
    } catch (e) {
        res.status(500).send('server error');
    }
})

// @route POST api/profile/experience
// @desc add profile experience
// @access private
router.put('/experience', [auth,
    check('company', 'company is required').not().isEmpty(),
    check('title', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()
], async (req, res) => {
    const {description, current, from, to, company, location, title} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const experience = {};
    if (description) experience.description = description;
    if (current) experience.current = current;
    if (from) experience.from = from;
    if (to) experience.to = to;
    if (company) experience.company = company;
    if (location) experience.location = location;
    if (title) experience.title = title;
    try {
        const profile = await Profile.findOne({user: req.user.id});
        if (profile) {
            profile.experience.unshift(experience);
            console.log(profile);
            await Profile.findOneAndUpdate({user: req.user.id}, {$set: profile})
            return res.json(profile);
        }
        res.status(400).json({msg: 'no such profile'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({e: e});
    }
})
// @route delete api/profile/experience
// @desc delete experience from profile
// @access private
router.delete('/experience/:experience_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        // generate new array of profile's experiences, and find the index of the experience we want to remove
        const indexToRemove = await profile.experience.map(ex => ex.id).indexOf(req.params.experience_id);
        if (indexToRemove === -1) {
            return res.status(400).send('no such experience');
        }
        profile.experience.splice(indexToRemove, 1);
        await Profile.findOneAndUpdate({user: req.user.id}, {$set: profile});
        res.json(profile);
    } catch (e) {
        res.status(500).send('server error');
    }
})

// @route POST api/profile/education
// @desc add profile education
// @access private
router.put('/education', [auth,
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty(),
    check('fieldofstudy', 'fieldofstudy date is required').not().isEmpty()
], async (req, res) => {
    const {description, current, from, to, school, degree, fieldofstudy} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const newEducation = {};
    if (description) newEducation.description = description;
    if (current) newEducation.current = current;
    if (from) newEducation.from = from;
    if (to) newEducation.to = to;
    if (school) newEducation.school = school;
    if (degree) newEducation.degree = degree;
    if (fieldofstudy) newEducation.fieldofstudy = fieldofstudy;
    try {
        const profile = await Profile.findOne({user: req.user.id});
        if (profile) {
            profile.education.unshift(newEducation);
            await Profile.findOneAndUpdate({user: req.user.id}, {$set: profile});
            return res.json(profile);
        }
        res.status(400).json({msg: 'no such profile'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({e: e});
    }
})
// @route delete api/profile/education
// @desc delete education from profile
// @access private
router.delete('/education/:education_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id});
        // generate new array of profile's experiences, and find the index of the experience we want to remove
        const indexToRemove = await profile.education.map(ex => ex.id).indexOf(req.params.education_id);
        if (indexToRemove === -1) {
            return res.status(400).send('no such education');
        }
        profile.education.splice(indexToRemove, 1);
        await Profile.findOneAndUpdate({user: req.user.id}, {$set: profile})
        res.json(profile);
    } catch (e) {
        res.status(500).send('server error');
    }
})

// @route get api/profile/github/:username
// @desc get user repos from github
// @access public
router.get('/github/:username', async (req, res) => {
    try {
        const url = `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
             client_id=${config.get('githubClientId')}&
             client_secret=${config.get('githubSecret')}`
        axios.get(url, {
            headers: {'user-agent': 'node.js'}
        })
            .then(function (response) {
                res.json(response.data);
            })
            .catch(function (error) {
                console.log(error);
                res.status(500).send({msg: 'no git hub profile'});
            })
    } catch (e) {
        console.log(e);
        res.status(500).send('server error');
    }
})
module.exports = router;
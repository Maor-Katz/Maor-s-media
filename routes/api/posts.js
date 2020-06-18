const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const {check, validationResult} = require('express-validator');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route POST api/posts
// @desc create post
// @access Private
router.post('/', [auth,
    check('text', 'must display post body').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error')
    }
})

// @route get api/posts
// @desc get user posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const allPosts = await Post.find().sort({date: -1})
        res.json(allPosts)
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error')
    }
})

// @route get api/posts/:post_id
// @desc get specific post by post id
// @access Private
router.get('/:post_id', auth, async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
        if (!specificPost) {
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(specificPost)
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})

// @route delete api/posts/:post_id
// @desc delete post by post's owner
// @access Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
        if (!specificPost) {
            return res.status(404).json({msg: 'Post not found'})
        }

        //check if this user is the owner of this post:
        if (specificPost.user.toString() !== req.user.id) {
            return res.status(401).json({msg: `User not authorized`})
        }

        await Post.remove({_id: req.params.post_id}, {justOne: true})


        res.json({msg: 'post removed'})
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})

// @route put api/posts/like
// @desc like post
// @access Private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
//check if post exists
        if (!specificPost) {
            return res.json({msg: 'post not found'})
        }

        const user = await User.findById(req.user.id);
//check if post already liked by current user
        if (specificPost.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'This post already liked by this user'})
        }

        specificPost.likes.unshift({
            user: req.user.id,
            name: user.name,
            avatar: user.avatar
        })

        await Post.findOneAndUpdate({_id: req.params.post_id}, {$set: specificPost});
        res.json(specificPost.likes);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})

// @route put api/posts/unlike
// @desc unlike post
// @access Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
//check if post exists
        if (!specificPost) {
            return res.json({msg: 'post not found'})
        }

        const user = await User.findById(req.user.id);
//check if post already unliked by current user
        if (specificPost.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'User did not like this post'})
        }

        specificPost.likes = specificPost.likes.filter(like => like.user.toString() !== req.user.id);

        await Post.findOneAndUpdate({_id: req.params.post_id}, {$set: specificPost});
        res.json(specificPost.likes);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})

// @route put api/posts/comment
// @desc add comment to post
// @access Private
router.put('/comment/:post_id', [auth,
    check('text', 'text field is required').not().isEmpty()
], async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
//check if post exists
        if (!specificPost) {
            return res.json({msg: 'post not found'})
        }

        const user = await User.findById(req.user.id);

        specificPost.comments.unshift({
            user: req.user.id,
            name: user.name,
            avatar: user.avatar,
            text: req.body.text
        })

        await Post.findOneAndUpdate({_id: req.params.post_id}, {$set: specificPost});
        res.json(specificPost.comments);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})

// @route delete api/posts/deletecomment/post_id/comment_id
// @desc delete comment
// @access Private
router.delete('/deletecomment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const specificPost = await Post.findById(req.params.post_id)
//check if post exists
        if (!specificPost) {
            return res.json({msg: 'post not found'})
        }
//check if comment exists
        let specificComment = await specificPost.comments.filter(comment => comment.id.toString() === req.params.comment_id)
//specificComment return array
        if (specificComment.length > 0) {
            specificComment = specificComment[0]
        }
        if (!specificComment) {
            return res.json({msg: 'comment not found'})
        }

//check if user is trying to delete his comment and not other comments
        if (req.user.id !== specificComment.user.toString()) {
            return res.json({msg: 'This user can not delete this post'})
        }
//update comments array at post's comments array
        let newCommentsArray = specificPost.comments.filter(comment => comment._id.toString() !== req.params.comment_id)
        specificPost.comments = newCommentsArray;

        await Post.findOneAndUpdate({_id: req.params.post_id}, {$set: specificPost});
        res.json(specificPost.comments);
    } catch (err) {
        if (err.message.includes('Cast to ObjectId failed')) {
            return res.status(400).json({msg: 'Post not found'})
        }
        console.log(err);
        res.status(500).send('Server Error')
    }
})


module.exports = router;
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addPost} from '../../actions/post'

const PostForm = props => {
    const [text, setText] = useState('');
    const createPost = (e) => {
        // e.preventDefault();
        props.addPost({text});
        setText('')
    }
    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Do something...</h3>
            </div>
            <form className="form my-1">
                <textarea cols="30" rows="5" required placeholder="Create a post..."
                          onChange={(e) => setText(e.target.value)} value={text}></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" onClick={(e) => createPost(e)}/>
            </form>
        </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired
};

export default connect(null, {addPost})(PostForm);
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addComment} from "../../actions/post";

const CommentForm = props => {
    const {addComment, postId} = props;
    const [text, setText] = useState('');
    const createComment = () => {
        addComment(postId, {text});
        setText('');
    };
    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave a comment...</h3>
            </div>
            <form className="form my-1">
                <textarea cols="30" rows="5" required placeholder="Create a post..."
                          onChange={(e) => setText(e.target.value)} value={text}></textarea>
                <input type="submit" className="btn btn-dark my-1" value="Submit" onClick={() => createComment()}/>
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired
};


export default connect(null, {addComment})(CommentForm);
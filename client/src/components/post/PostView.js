import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {getPost} from '../../actions/post'
import PostItem from '../posts/PostItem'
import Loader from "../Loader";
import CommentForm from "./CommentForm";
import store from "../../store";
import {CLEAR_POST} from "../../actions/types";
import CommentItem from "./CommentItem";

const PostView = props => {
    const {post: {post, loading}, getPost} = props;
    useEffect(() => {
        getPost(props.match.params.id)
    }, [getPost, props.match.params.id])
    return (
        <div>{loading || post === null ? <Loader/> : <div>
            <Link to="/posts" className="btn" onClick={() => store.dispatch({type: CLEAR_POST})}>
                Back To Posts
            </Link>
            <PostItem post={post} showActions={false}/>
            <CommentForm postId={post._id}/>
            <div className="comments">
                {post.comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} postId={post._id}/>
                ))}
            </div>
        </div>}

        </div>
    );
};

PostView.propTypes = {
    post: PropTypes.object.isRequired,
    getPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, {getPost})(withRouter(PostView));
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getPosts} from '../../actions/post';
import Loader from "../Loader";
import PostItem from "./PostItem";
import PostForm from "./PostForm";


const Posts = props => {
    const {post: {posts, loading}, getPosts} = props;
    useEffect(() => {
        getPosts();
    }, [getPosts])
    return (loading ? <Loader/> : <div>
            <PostForm/>
            <h1 className="large text-primary">Post</h1>
            <p className="lead">
                <i className="fas fas-user"></i>Welcome to community
            </p>
            <div className="posts">
                {posts.map(p=>(
                    <PostItem key={p._id} post={p} showActions={true}/>
                ))}
            </div>
        </div>
    );
};

Posts.propTypes = {
    post: PropTypes.object.isRequired,
    getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => {
    return{
    post: state.post
}}

export default connect(mapStateToProps, {getPosts})(Posts);
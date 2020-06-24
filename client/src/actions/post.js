import axios from 'axios';
import {setAlert} from './alert';
import {
    ADD_COMMENT,
    ADD_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    REMOVE_COMMENT,
    UPDATE_LIKES
} from "./types";

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        });

    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}
//get specific post
export const getPost = (postId) => async dispatch => {
    try {
        const res = await axios.get(`/posts/${postId}`);
        dispatch({
            type: GET_POST,
            payload: res.data
        });

    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}


export const addLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/posts/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {likes: res.data, id: postId}
        });

    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}

export const removeLike = (postId) => async dispatch => {
    try {
        const res = await axios.put(`/posts/unlike/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload: {likes: res.data, id: postId}
        });

    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}

export const deletePost = (postId) => async dispatch => {
    try {
        await axios.delete(`/posts/${postId}`);
        dispatch({
            type: DELETE_POST,
            payload: postId
        });
        dispatch(setAlert('Post Removed', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}

export const addPost = (formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axios.post(`/posts`, formData, config);
        dispatch({
            type: ADD_POST,
            payload: res.data
        });
        dispatch(setAlert('Post Added', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}

export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = await axios.put(`/posts/comment/${postId}`, formData, config);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        });
        dispatch(setAlert('Comment Added', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}

export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/posts/deletecomment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });
        dispatch(setAlert('Comment Removed', 'success'))
    } catch (e) {
        dispatch({
            type: POST_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        });
    }
}
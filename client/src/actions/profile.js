import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROFILE,
    PROFILE_ERROR,
    GET_ALL_PROFILES,
    GET_REPOS,
    UPDATE_PROFILE,
    CLEAR_PROFILE, DELETE_ACCOUNT, SET_REPOS_NULL, ERASE_LOADING_PROFILE
} from './types';

export const getCurrentProfile = () => async dispatch => {
    try {
        //needs to display loader until data recieved from server
        dispatch({
            type: ERASE_LOADING_PROFILE
        })
        const res = await axios.get('profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

export const getAllProfiles = () => async dispatch => {
    try {
        //needs to display loader until data recieved from server
        dispatch({
            type: ERASE_LOADING_PROFILE
        });
        const res = await axios.get('profile/all');
        dispatch({
            type: GET_ALL_PROFILES,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: e
        })
    }
}

export const getProfileById = (id, history) => async dispatch => {
    try {
        const res = await axios.get(`/profile/user/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (e) {
        if (e.response.data.msg === 'profile not found') {
            history.push('/posts');
            dispatch(setAlert('Profile Not Exists', 'danger'))
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: e
        })
    }
}

export const getGithbRepos = (githubUsername) => async dispatch => {
    try {
        const res = await axios.get(`/profile/github/${githubUsername}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        })
    } catch (e) {
        //case user does not have github profile, its not error its ok
        if (e.response.data.msg === 'no git hub profile') {
            dispatch({
                type: SET_REPOS_NULL
            })
            return
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: e
        })
    }
}

//create of update profile
export const addOrUpdateProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.post('profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
//lets generate new alert
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));
        //if we adding new profile we want user redirect to dashboard:
        if (!edit) {
            history.push('/dashboard');
        }
    } catch (e) {
//case we have multiple errors and we want to generate multiple alerts:
        const errors = e.response.data.errors;
        if (errors.length > 0) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

//add experience to my profile
export const addExperienceProfile = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.put('profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
//lets generate new alert
        dispatch(setAlert('Added Experience', 'success'));
        //after added experience we want to redirect to dashboard
        history.push('/dashboard');
    } catch (e) {
//case we have multiple errors and we want to generate multiple alerts:
        const errors = e.response.data.errors;
        if (errors.length > 0) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
};

//add Education to my profile
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const res = await axios.put('profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
//lets generate new alert
        dispatch(setAlert('Added Experience', 'success'));
        //after added experience we want to redirect to dashboard
        history.push('/dashboard');
    } catch (e) {
//case we have multiple errors and we want to generate multiple alerts:
        const errors = e.response.data.errors;
        if (errors.length > 0) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
};

export const deleteExperience = (expId) => async dispatch => {
    try {
        const res = await axios.delete(`profile/experience/${expId}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience had been deleted', 'success'));
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
};
export const deleteEducation = (eduId) => async dispatch => {
    try {
        const res = await axios.delete(`profile/education/${eduId}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education had been deleted', 'success'));
    } catch (e) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg: e.response.statusText, status: e.response.status}
        })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? this can not be undone')) {
        try {
            await axios.delete(`profile/delete`);
            dispatch({type: CLEAR_PROFILE});
            dispatch({type: DELETE_ACCOUNT});

            dispatch(setAlert('Your account had been deleted'));
        } catch (e) {
            dispatch({
                type: PROFILE_ERROR,
                payload: {msg: e.response.statusText, status: e.response.status}
            })
        }
    }
}

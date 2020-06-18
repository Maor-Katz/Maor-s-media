import axios from 'axios';
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE
} from './types'
import {setAlert} from './alert'
import setAuthToken from "../utils/setAuthToken";

//load user
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: AUTH_ERROR
        })
    }

}

export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password})

    try {
        const res = await axios.post('users/register', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
        //put user details in store
        dispatch(loadUser())
    } catch (e) {
        //case we have multiple errors and we want to generate multiple alerts:
        const errors = e.response.data.errors;
        if (errors.length > 0) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}
//Login User
export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password})

    try {
        const res = await axios.post('auth/login', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        })
        //put user details in store
        dispatch(loadUser())
    } catch (e) {
        const errors = e.response.data.errors;
        if (errors.length > 0) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

//logout
export const logout = () => dispatch => {
    dispatch({type: CLEAR_PROFILE})
    dispatch({type: LOGOUT})
}
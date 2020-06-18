import {
    CLEAR_PROFILE, ERASE_LOADING, ERASE_LOADING_PROFILE,
    GET_ALL_PROFILES,
    GET_PROFILE,
    GET_REPOS,
    PROFILE_ERROR,
    SET_REPOS_NULL,
    UPDATE_PROFILE
} from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case PROFILE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
                profile: null
            }
        case UPDATE_PROFILE:
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            }

        case GET_ALL_PROFILES:
            return {
                ...state,
                profiles: action.payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: true,
            }
        case GET_REPOS:
            return {
                ...state,
                repos: action.payload,
                loading: false,
            };
        case SET_REPOS_NULL://after checking with github API, no repositories for current user, we want to set repos as null:
            return {
                ...state,
                repos: null,
                loading: false,
            };
        case ERASE_LOADING_PROFILE:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
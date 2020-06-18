import React, {useState} from 'react'
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {login} from '../../actions/auth'
import PropTypes from "prop-types";

const Login = (props) => {
    const loginUser = (e) => {
        e.preventDefault();
        props.login(email, password);
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    if (props.isAuthenticated) {
        return <Redirect to="/dashboard"/>
    }
    return (
        <div className="Login">
            <h1 className="large text-primary">
                Sign In
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i>
                Sign into your account
            </p>
            <form action="" className="form">
                <div className="form-group">
                    <input type="email" placeholder="Email Address"
                           onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" minLength="6"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input type="submit" value="Login" className="btn btn-primary" onClick={(e) => loginUser(e)}/>
            </form>
            <p className="my-1">
                Don't have an account?
                <Link to="/register">Sign Up</Link>
            </p>
        </div>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps, {login})(Login)
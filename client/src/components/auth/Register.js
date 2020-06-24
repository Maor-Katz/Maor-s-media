import React, {useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = (props) => {

    const registerUser = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.log('passwords do not match');
            props.setAlert('passwords do not match', 'danger', 5000);
        } else {
            props.register({name, email, password});
        }
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    if (props.isAuthenticated) {
        return <Redirect to="/dashboard"/>
    }

    return (
        <div className="Register">
            <h1 className="large text-primary">
                Sign Up
            </h1>
            <p className="lead">
                <i className="fas fa-user"></i>
                Create your account
            </p>
            <form action="" className="form">
                <div className="form-group">
                    <input type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
                    <small className="form-text">
                        This site uses Gravatar, so if you eant profile image, use Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" minLength="6"
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm Password" minLength="6"
                           onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <input type="submit" value="Register" className="btn btn-primary" onClick={(e) => registerUser(e)}/>
            </form>
            <p className="my-1">
                Already have an account?
                <Link to="/login">Sign In</Link>
            </p>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated
})

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps, {setAlert, register})(Register);
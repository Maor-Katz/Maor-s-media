import React from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';

const Navbar = (props) => {
    const {isAuthenticated} = props.auth;

    const guestLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    )

    const authLinks = (
        <ul>
            <li>
                <Link to="/profiles">
                    Developers
                </Link>
            </li>
            <li>
                <Link to="/posts">
                    Posts
                </Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user"></i>{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <Link to="/login" onClick={() => props.logout()}>
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className="hide-sm">Logout</span>
                </Link>
            </li>
        </ul>
    )

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/dashboard">
                    <i className="fas fa-code"></i> Maor-connectors
                </Link>
            </h1>
            {/*check if done loading:*/}
            {!props.auth.loading && <div>
                {/*after done loading, check if user logged in*/}
                {isAuthenticated ? authLinks : guestLinks}
            </div>}

        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {logout})(Navbar);
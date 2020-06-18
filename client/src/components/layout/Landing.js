import React from 'react'
import {Link, Redirect} from "react-router-dom";
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import Loader from "../Loader";

const Landing = (props) => {

    if (props.auth.loading === true) {
        return <Loader/>
    }

    if (props.auth.isAuthenticated) {
        return <Redirect to="/dashboard"/>
    }

    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Maor's Media</h1>
                    <p className="lead">Create developer profile/portfolio, share posts and get help from other
                        developers</p>
                    <div className="buttons">
                        <Link to="/register" className="btn btn-primary">Sign up</Link>
                        <Link to="/login" className="btn">Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
};


const mapStateToProps = (state) => ({
    auth: state.auth
})


export default connect(mapStateToProps)(Landing)
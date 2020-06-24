import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getCurrentProfile, deleteAccount} from '../../actions/profile';
import {loadUser} from '../../actions/auth';
import Loader from "../Loader";
import {Link} from "react-router-dom";
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = (props) => {
    const {user} = props.auth;
    const {profile, getCurrentProfile} = props;
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    if (profile.loading) {
        return <Loader/>
    }
    return (
        <div className="Dashboard">
            <h1 className="large text-primary"> Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user"></i>
                Welcome {user && user.user.name}
            </p>
            {profile.profile !== null ? <div>
                <DashboardActions/>
                <Experience/>
                <Education/>
                <div className="my-2">
                    <button className="btn btn-danger"
                            onClick={() => props.deleteAccount(user.user._id, props.history)}>
                        <i className="fas fa-user-minus"></i>
                        Delete Account
                    </button>
                </div>
            </div> : <div>
                <p>you have not yet setup profile, please add some info</p>
                <Link to='/create-profile' className="btn btn-primary my-1">
                    Create Profile
                </Link>
            </div>}
        </div>
    )
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    loadUser: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired
};


const mapStateToProps = (state, ownProps) => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, loadUser, deleteAccount})(Dashboard);
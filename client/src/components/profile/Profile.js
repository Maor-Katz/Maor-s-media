import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getProfileById} from '../../actions/profile';
import PropTypes from 'prop-types';
import Loader from "../Loader";
import {Link, withRouter} from "react-router-dom";
import {CLEAR_PROFILE} from "../../actions/types";
import store from "../../store";
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = (props) => {
    const {getProfileById, profile, auth: {loading, user, isAuthenticated}} = props;

    useEffect(() => {
        getProfileById(props.match.params.id, props.history);
    }, [getProfileById]);
    return (
        <div>
            {profile.profile === null || profile.loading ? <Loader/> : <div>
                <Link to="/profiles" className="btn btn-light" onClick={() => store.dispatch({type: CLEAR_PROFILE})}>Back
                    To Profiles</Link>
                {isAuthenticated && loading === false && user.user && user.user._id === profile.profile.user._id &&
                <Link to='/edit-profile' className="btn btn-dark">Edit Profile</Link>}
                <div className="profile-grid my-1">
                    <ProfileTop profile={profile.profile}/>
                    <ProfileAbout profile={profile.profile}/>
                    {/*Experience:*/}
                    <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Experience</h2>
                        {profile.profile.experience.length > 0 ? <div>
                            {profile.profile.experience.map(ex => (
                                <ProfileExperience ex={ex} key={ex._id}/>
                            ))}
                        </div> : <h4>No experience credentials</h4>}
                    </div>
                    {/*Education:*/}
                    <div className="profile-edu bg-white p-2">
                        <h2 className="text-primary">Education</h2>
                        {profile.profile.education.length > 0 ? <div>
                            {profile.profile.education.map(ed => (
                                <ProfileEducation ed={ed} key={ed._id}/>
                            ))}
                        </div> : <h4>No education credentials</h4>}
                    </div>
                    {profile.profile.githubusername && (
                        <ProfileGithub username={profile.profile.githubusername}/>
                    )}
                </div>
            </div>}
        </div>
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth
})
export default connect(mapStateToProps, {getProfileById})(withRouter(Profile));
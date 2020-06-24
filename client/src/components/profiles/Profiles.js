import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getAllProfiles} from '../../actions/profile';
import Loader from "../Loader";
import ProfileItem from "./ProfileItem";

const Profiles = (props) => {
    const {profile: {loading, profiles},getAllProfiles} = props;
    useEffect(() => {
        getAllProfiles();
    }, [getAllProfiles])
    return (
        <div className="container">
            {loading ? <Loader/> : <div>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fab fa-connectdevelop"></i>Browse and connect with developers
                </p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(p => (
                            <ProfileItem key={p._id} profile={p}/>
                        ))
                    ) : 'No profiles found'}
                </div>
            </div>}
        </div>
    );
};

Profiles.propTypes = {
    getAllProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    }
};

export default connect(mapStateToProps, {getAllProfiles})(Profiles);
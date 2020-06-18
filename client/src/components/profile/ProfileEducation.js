import React from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";

const ProfileEducation = props => {
    const {ed: {to, from, description, current, fieldofstudy, degree, school}} = props;
    return (
        <div>
            <h3 className="text-dark">{school}</h3>
            <p>
                <Moment format="YYYY/MM/DD">{from}</Moment> - {!to ? 'Now' : <Moment format="YYYY/MM/DD">{to}</Moment>}
            </p>
            <p>
                <strong>Degree: </strong>{degree}
            </p>
            <p>
                <strong>Field Of Study: </strong>{fieldofstudy}
            </p>
            <p>
                <strong>Description: </strong>{description}
            </p>
        </div>
    );
};

ProfileEducation.propTypes = {
    ed: PropTypes.object.isRequired
};

export default ProfileEducation;
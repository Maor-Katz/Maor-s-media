import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {deleteExperience} from '../../actions/profile'
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const Experience = (props) => {
    const {experience} = props;
    const experiences = experience.map(ex => (
        <tr key={ex._id}>
            <td>{ex.company}</td>
            <td className="hide-sm">{ex.title}</td>
            <td className="hide-sm"><Moment format="YYYY/MM/DD">{ex.from}</Moment>{' '}-{' '}{
                ex.to === null ? (' Now') : <Moment format="YYYY/MM/DD">{ex.to}</Moment>
            }</td>
            <td>
                <button className="btn btn-danger" onClick={() => props.deleteExperience(ex._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <div>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Company</th>
                    <th className="hide-ms">Title</th>
                    <th className="hide-ms">Years</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {experiences}
                </tbody>
            </table>
        </div>
    );
};
    Experience.propTypes = {
        experience: PropTypes.array.isRequired
    };

const mapStateToProps = (state) => {
    return {
        experience: state.profile.profile.experience
    }
};

export default connect(mapStateToProps, {deleteExperience})(withRouter(Experience));
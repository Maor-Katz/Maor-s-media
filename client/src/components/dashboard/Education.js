import React from 'react';
import Moment from "react-moment";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {deleteEducation} from '../../actions/profile';
import PropTypes from "prop-types";

const Education = (props) => {
    const {education} = props;
    const educations = education.map(ed => (
        <tr key={ed._id}>
            <td>{ed.school}</td>
            <td className="hide-sm">{ed.degree}</td>
            <td className="hide-sm"><Moment format="YYYY/MM/DD">{ed.from}</Moment>{' '}-{' '}{
                ed.to === null ? (' Now') : <Moment format="YYYY/MM/DD">{ed.to}</Moment>
            }</td>
            <td>
                <button className="btn btn-danger" onClick={()=>props.deleteEducation(ed._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <div>
            <h2 className="my-2">Education Credentials</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>School</th>
                    <th className="hide-ms">Degree</th>
                    <th className="hide-ms">Years</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {educations}
                </tbody>
            </table>
        </div>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
    return {
        education: state.profile.profile.education
    }
};

export default connect(mapStateToProps, {deleteEducation})(withRouter(Education));
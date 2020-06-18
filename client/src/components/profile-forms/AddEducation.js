import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addEducation} from '../../actions/profile';
import {Link, withRouter} from "react-router-dom";


const AddEducation = (props) => {
    const [formData, setFormData] = useState({
        description: '',
        current: false,
        from: '',
        to: '',
        school: '',
        fieldofstudy: '',
        degree: ''
    });
    const [toToggleDisabled, setToToggleDisabled] = useState(false);

    const updateForm = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const addEducation = (e) => {
        e.preventDefault();
        props.addEducation(formData, props.history);
    };

    return (
        <section className="container">
            <h1 className="large text-primary">
                Add Your Education
            </h1>
            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form className="form">
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* School or Bootcamp"
                        name="school"
                        required
                        onChange={(e) => updateForm(e)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="* Degree or Certificate"
                        name="degree"
                        required
                        onChange={(e) => updateForm(e)}
                    />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Field Of Study" name="fieldofstudy"
                           onChange={(e) => updateForm(e)}/>
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from"
                           onChange={(e) => updateForm(e)}/>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to"
                           onChange={(e) => updateForm(e)}
                           disabled={toToggleDisabled ? true : false}/>
                </div>
                <div className="form-group">
                    <p>
                        <input type="checkbox" name="current" value=""
                               onChange={(e) => {
                                   formData['current'] = !formData['current'];
                                   setToToggleDisabled(!toToggleDisabled)
                               }}/> Current School
                    </p>
                </div>
                <div className="form-group">
          <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Program Description"
              onChange={(e) => updateForm(e)}
          ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1"
                       onClick={(e) => addEducation(e)}/>
                <Link to="/dashboard" className="btn my-1">Go Back</Link>
            </form>
        </section>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({})
//in order to get props.history we need to use withRouter from react router
export default connect(mapStateToProps, {addEducation})(withRouter(AddEducation))
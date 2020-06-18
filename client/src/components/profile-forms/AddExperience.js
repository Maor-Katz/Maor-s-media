import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addExperienceProfile} from '../../actions/profile';
import {Link, withRouter} from "react-router-dom";


const AddExperience = (props) => {
    const [formData, setFormData] = useState({
        description: '',
        current: false,
        from: '',
        to: '',
        company: '',
        location: '',
        title: ''
    });
    const {current, description, from, to, company, location, title} = formData;
    const [toToggleDisabled, setToToggleDisabled] = useState(false);
    const updateForm = e => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const addExperience = (e) => {
        e.preventDefault();
        props.addExperienceProfile(formData, props.history);
    };

    return (
        <section className="container">
            <h1 className="large text-primary">
                Add An Experience
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>
            <form className="form">
                <div className="form-group">
                    <input type="text" placeholder="* Job Title" name="title" required
                           value={title}
                           onChange={(e) => updateForm(e)}/>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="* Company" name="company" required
                           onChange={(e) => updateForm(e)}
                           value={company}/>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Location" name="location"
                           onChange={(e) => updateForm(e)}
                           value={location}/>
                </div>
                <div className="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from"
                           onChange={(e) => updateForm(e)}
                           value={from}/>
                </div>
                <div className="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to"
                           disabled={toToggleDisabled ? true : false}
                           onChange={(e) => updateForm(e)}
                           value={to}/>
                </div>
                <div className="form-group">
                    <p><input type="checkbox" name="current" value={current}
                              onChange={(e) => {
                                  formData['current'] = !formData['current'];
                                  setToToggleDisabled(!toToggleDisabled)
                              }}/> Current Job</p>
                </div>
                <div className="form-group">
          <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Job Description"
              onChange={(e) => updateForm(e)}
              value={description}
          ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1"
                       onClick={(e) => addExperience(e)}/>
                <Link to='/dashboard' className="btn my-1">Go Back</Link>
            </form>
        </section>
    )
}

AddExperience.propTypes = {
    addExperienceProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({})
//in order to get props.history we need to use withRouter from react router
export default connect(mapStateToProps, {addExperienceProfile})(withRouter(AddExperience))
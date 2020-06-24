import React from 'react';
import {Route, Redirect, withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dashboard from "../dashboard/Dashboard";
import Loader from '../Loader';

const PrivateRoute = (props) => {
    const {auth, component: Component,...rest} = props;
    return (
        <Route {...rest} render={props => {
            if (auth.loading) {
                return <Loader/>
            } else {
                return auth.isAuthenticated ?
                    <Component {...props} />
                    : <Redirect to="/login"/>
            }
        }}/>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(withRouter(PrivateRoute));
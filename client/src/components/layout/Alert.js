import React from 'react'
import PropTypes from 'prop-types';
import {connect} from "react-redux";

const Alert = (props) => {
    return (
        <div>
            {props.alerts.length > 0 && <div>
                {props.alerts.map(alert => (
                    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                        {alert.msg}
                    </div>
                ))}
            </div>}
        </div>
    )
}

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
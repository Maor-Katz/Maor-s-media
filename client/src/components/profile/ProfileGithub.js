import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getGithbRepos} from '../../actions/profile';
import Loader from "../Loader";

const ProfileGithub = props => {
    const {username, profile} = props;
    useEffect(() => {
        props.getGithbRepos(username)
    }, [])
    if (profile.repos === null) {
        //case user inserted username github, but does not have any repositories to show:
        return <div className='text-primary p-1'>No github repositories for this user</div>
    }
    return (
        <div className="profile-github">
            <h2>Github Repos</h2>
            {profile.repos.length === 0 ? <Loader/> : <div>
                {profile.repos.map(repo => (
                    <div key={repo.id} className="repo bg-white p-1 my-1">
                        <div>
                            <h4>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferer">{repo.name}</a>
                            </h4>
                            <p>
                                {repo.description}
                            </p>
                        </div>
                        <ul>
                            <li className="badge badge-primary p-1">
                                Stars: {repo.stargazers_count}
                            </li>
                            <li className="badge badge-dark p-1">
                                Watchers: {repo.watchers_count}
                            </li>
                            <li className="badge badge-dark p-1">
                                Forks: {repo.forks_count}
                            </li>
                        </ul>
                    </div>
                ))}
            </div>}
        </div>


    );
};

ProfileGithub.propTypes = {
    username: PropTypes.string.isRequired,
    getGithbRepos: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getGithbRepos})(ProfileGithub);
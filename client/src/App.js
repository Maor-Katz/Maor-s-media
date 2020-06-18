import React, {useEffect} from 'react';
import './App.css';
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Register from './components/auth/Register'
import CreateProfile from './components/profile-forms/CreateProfile'
import AddExperience from './components/profile-forms/AddExperience'
import Profiles from './components/profiles/Profiles'
import AddEducation from './components/profile-forms/AddEducation'
import EditProfile from './components/profile-forms/EditProfile'
import Profile from "./components/profile/Profile";
import Login from './components/auth/Login'
import Posts from './components/posts/Posts'
import Alert from './components/layout/Alert'
//Redux
import {Provider} from 'react-redux';
import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from './actions/auth'
import PostView from "./components/post/PostView";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

function App() {

    useEffect(() => {
        store.dispatch(loadUser());
    }, []);
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Navbar/>
                    <Route exact path="/" component={Landing}/>
                    <section className="container">
                        <Alert/>
                        <Switch>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/profiles" component={Profiles}/>
                            <Route exact path="/profile/:id" component={Profile}/>
                            <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                            <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
                            <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                            <PrivateRoute exact path="/add-experience" component={AddExperience}/>
                            <PrivateRoute exact path="/add-education" component={AddEducation}/>
                            <PrivateRoute exact path="/posts" component={Posts}/>
                            <PrivateRoute exact path="/posts/:id" component={PostView}/>
                        </Switch>
                    </section>
                </div>
            </Router>
        </Provider>
    );
}

export default App;

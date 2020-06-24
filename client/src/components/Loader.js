import React from 'react';

class Loader extends React.Component {

    render() {
        return <div className="LoaderPage">
            <div className="loaderWrapper"><img src="https://media.giphy.com/media/MDrmyLuEV8XFOe7lU6/giphy.gif" className="loadGif" alt="alt"/></div>
        </div>
    }
}

export default Loader;
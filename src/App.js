import React from 'react';

import Tabs from './Tabs'
import VideoPanel from './VideoPanel'

class App extends React.Component {
  // initialize state
  state = {

  };

  // Within each tab goes the content for the given tab
  render() {
    return (
      <div>
        <h1>INDEFATIGABLE</h1>
        <Tabs>
          <div label="Videos">
            <VideoPanel />
          </div>
          <div label="Playlists">
            <h3>Playlists!</h3>
          </div>
        </Tabs>
      </div>
    );
  }
}

export default App;

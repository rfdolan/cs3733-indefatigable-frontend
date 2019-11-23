import React from 'react';

import Tabs from './Tabs'
import VideoPanel from './VideoPanel'
import PlaylistPanel from './PlaylistPanel'

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
            <PlaylistPanel />
          </div>
        </Tabs>
      </div>
    );
  }
}

export default App;

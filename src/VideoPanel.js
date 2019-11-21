import React from 'react'
import Video from './Video'

class VideoPanel extends React.Component {

    uploadNewSegment = () =>{
        console.log("You want to upload a new segment don't you squidward.");
    }
    render() {
        return (
            <div>
                <button type="button" onClick={this.uploadNewSegment}>Upload new video</button>
            <Video></Video>
            <Video></Video>
            </div>
        );
    }
}

export default VideoPanel;
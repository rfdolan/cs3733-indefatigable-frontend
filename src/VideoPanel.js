import React from 'react'
import Video from './Video'
import axios from 'axios'
import './api/api.js'

const sampleData = [{title: "Vid Title", transcript: "It is illogical", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/Kirk-ItIsIllogical.ogg",
character: "Kirk", isRemote: false, isRemoteAvailable: true}, {title: "Vid2 Title", transcript: "Arg", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/fisher-agh.ogg",
character: "Fisher", isRemote: false, isRemoteAvailable: true}];
class VideoPanel extends React.Component {

    state = {
        videos: sampleData,
        localOnly: false,
    }

    uploadNewSegment = () =>{
        console.log("You want to upload a new segment don't you squidward.");
    }

    /*
    getAllVideos = () => {
        axios.get(get_all_videos_url).then((res) => {this.setState( { videos: res.list })});

    }
    */
    
    renderVideos = () => {
        let vids = [];
        for(let i=0; i<this.state.videos.length; i++ ) {
            let currVid = this.state.videos[i];
            vids.push(<div style={{padding: "5px", float: "left"}}><Video title={currVid.title} transcript={currVid.transcript} url={currVid.url} 
                character={currVid.character} isRemote={currVid.isRemote} isRemotelyAvailable={currVid.isRemotelyAvailable}></Video></div>);
        }
        return vids;

    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.uploadNewSegment}>Upload new video</button>
                {this.renderVideos()}
            </div>
        );
    }
}

export default VideoPanel;
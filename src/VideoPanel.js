import React from 'react'
import Video from './Video'
import axios from 'axios'
import './style/VideoPanel.css'
import base_url from './api/api.js'

const get_all_videos_url = base_url + "getAllSegments"
const create_url = base_url + "uploadVideoSegment"
/*
const sampleData = [{title: "Vid Title", transcript: "It is illogical", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/Kirk-ItIsIllogical.ogg",
character: "Kirk", isRemote: false, isRemoteAvailable: true}, {title: "Vid2 Title", transcript: "Arg", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/fisher-agh.ogg",
character: "Fisher", isRemote: true, isRemoteAvailable: true}];
*/
class VideoPanel extends React.Component {
    _isMounted = false;

    state = {
        videos: [],
        localOnly: false,
        newVideoTitle: "",
        newVideoCharacter: "",
        newVideoTranscript: "",
        newVideoFile: null,
        newVideoB64: "",
        needFields: true,
    }

    // These two functions make us promise not to update the state if the component
    // is not mounted.
    componentDidMount() {
        this._isMounted = true;
        this.getAllVideos();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    uploadNewSegment = () =>{
	this.handleCreateClick();
    }
    
    getAllVideos = () => {
        axios.get(get_all_videos_url)
        .then((res) => {this.setState( { videos: res.data.list })})
        .then(() => {if(this._isMounted) {this.renderVideos()}});
    }

    toggleFilter = () => {
        this.setState({localOnly: !this.state.localOnly});
        this.renderVideos();
    }

    renderVideos = () => {
        // Array of JSX videos we want to render.
        let vids = [];
        for(let i=0; i<this.state.videos.length; i++ ) {
            let currVid = this.state.videos[i];
            // If we are not filtering by local only OR if we are and this is a local video, add it to the array.
            if((!this.state.localOnly) || (this.state.localOnly && !currVid.isRemote)){
                vids.push(<li key={currVid.vuid} style={{listStyleType: "none", padding: "5px", float: "left"}}><Video title={currVid.title} transcript={currVid.transcript} url={currVid.url} 
                    character={currVid.character} isRemote={currVid.isRemote} isRemotelyAvailable={currVid.isRemotelyAvailable} id={currVid.vuid} deleteVideoHandler={this.getAllVideos}></Video></li>);
            }
        }
        // Return our JSX tags to render.
        return vids;

    }

    processCreateResponse = (result) => {
        // Can grab any DIV or SPAN HTML element and can then manipulate its
        // contents dynamically via javascript
        console.log("result:" + result);
        this.getAllVideos();
    }       

    handleCreateClick = (e) => {
        //console.log(this.state);
        
        var data = {};
        data["title"] = this.state.newVideoTitle;
        data["transcript"] = this.state.newVideoTranscript;
        data["character"] = this.state.newVideoCharacter;
        
        // base64EncodedValue":"data:text/plain;base64,My4xND....."
        var segments = this.state.newVideoB64.split(',');
        data["video"] = segments[1];  // skip first one 

        var js = JSON.stringify(data);
        console.log("JS:" + js);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", create_url, true);

        // send the collected data as JSON
        xhr.send(js);
        console.log("Sent");

        /*
        // This will process results and update HTML as appropriate. 
        xhr.onloadend = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log ("XHR:" + xhr.responseText);
                    this.processCreateResponse(xhr.responseText);
                } else {
                    console.log("actual:" + xhr.responseText)
                    var js = JSON.parse(xhr.responseText);
                    var err = js["response"];
                    alert (err);
                }
            } else {
                this.processCreateResponse("N/A");
            }
            this.setState({
                newVideoB64: "",
                newVideoCharacter: "",
                newVideoFile: "",
                newVideoTitle: "",
                newVideoTranscript: ""
            })
        };
        */
    }

    encodeFile = (file) => {
        //console.log("File " + file);
    	var reader = new FileReader();
        reader.readAsDataURL(file);

        //console.log(reader);
        reader.onload =  ()=> {
            this.setState({newVideoB64: reader.result, needFields: false});
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleVideoChange = (e) => {
        //console.log(e);
        var files = e.target.files;
        if (files[0].size > 1000000) {  // make as large or small as you need
            this.setState({newVideoB64:""});
            alert("File size too large to use:" + files[0].size + " bytes");
        }
    
        this.encodeFile(files[0]);
        this.handleChange(e);
        this.setState({
            needFields: false
        })
    }
//<input name="newPlaylistName" value={this.state.newPlaylistName} type="text" onChange={e => this.handleChange(e)}></input>
    render() {
        return (
            <div>
                <div>
                    <form>
                        <label style={{display:"inline-block"}}>
                            Search Text:
                            <input type="text" placeholder="Text to search for" style={{margin: "5px"}} />
                            Character:
                            <input type="character" placeholder="Character name" style={{margin: "5px"}}/>
                            <button type="submit">Go</button>
                        </label>
                    </form>
                    <p>Local segments only</p>
                    <label className="switch">
                        <input type="checkbox" onClick={this.toggleFilter}></input>
                        <span className="slider round"></span>
                    </label>
                </div>
                <br />

                <form name ="createForm">
                Video Title:<input name="newVideoTitle" type="text" placeholder="Video Title" value={this.state.newVideoTitle} onChange={e => this.handleChange(e)} style={{margin: "5px"}} />
                                <input type="base64Encoding"  name="newVideoB64" hidden />
                Video Character:<input name="newVideoCharacter" value={this.state.newVideoCharacter} type="text" placeholder="Video Character" onChange={e => this.handleChange(e)} style={{margin: "5px"}} />
                Video Transcript:<input name="newVideoTranscript" value={this.state.newVideoTranscript} type="text" placeholder="Video Transcript" onChange={e => this.handleChange(e)} style={{margin: "5px"}} />
                Select a video file: <input name="newVideoFile"  type="file"  onChange={e => this.handleVideoChange(e)}  />
                <button type="button" onClick={this.uploadNewSegment} disabled={this.state.needFields}>Upload new video</button><br />
                <br />
                {this.renderVideos()}
            </form>
      </div>  );
    } 
}

export default VideoPanel;

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
        console.log("You want to upload a new segment don't you squidward.");
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
    encodeFile = (file) => {
    	var reader = new FileReader();
	reader.readAsDataURL(file);

	reader.onload = function () {
	  document.createForm.base64Encoding.value = reader.result;
	  document.createForm.createButton.disabled = false;
	};
        }
    renderVideos = () => {
        // Array of JSX videos we want to render.
        let vids = [];
        for(let i=0; i<this.state.videos.length; i++ ) {
            let currVid = this.state.videos[i];
            // If we are not filtering by local only OR if we are and this is a local video, add it to the array.
            if((!this.state.localOnly) || (this.state.localOnly && !currVid.isRemote)){
                vids.push(<li key={currVid.vuid} style={{listStyleType: "none", padding: "5px", float: "left"}}><Video title={currVid.title} transcript={currVid.transcript} url={currVid.url} 
                    character={currVid.character} isRemote={currVid.isRemote} isRemotelyAvailable={currVid.isRemotelyAvailable} id={currVid.vuid}></Video></li>);
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
  var form = document.createForm;
 
  var data = {};
  data["name"]               = form.constantName.value;
  
  if (form.system.checked) {  // be sure to flag system constant requests...
     data["system"] = true;
  }
  
  // base64EncodedValue":"data:text/plain;base64,My4xND....."
  var segments = document.createForm.base64Encoding.value.split(',');
  data["base64EncodedValue"] = segments[1];  // skip first one 

  var js = JSON.stringify(data);
  console.log("JS:" + js);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", create_url, true);

  // send the collected data as JSON
  xhr.send(js);

  // This will process results and update HTML as appropriate. 
  xhr.onloadend = function () {
    console.log(xhr);
    console.log(xhr.request);
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
  };
}

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
Video Title:<input type="text" placeholder="Video Title" style={{margin: "5px"}} />
                <input type="base64Encoding" hidden value=""/>
Video Character:<input type="text" placeholder="Video Character" style={{margin: "5px"}} />
Video Transcript:<input type="text" placeholder="Video Transcript" style={{margin: "5px"}} />
Select a video file: <input type="file" id="videoF" name="videoF" />
                <button type="button" onClick={this.uploadNewSegment}>Upload new video</button><br />
                <br />
                {this.renderVideos()}
            </div>
        );
    }
}

export default VideoPanel;

import React from 'react'
import Video from './Video'
import axios from 'axios'
import './style/VideoPanel.css'
import base_url from './api/api.js'
import UploadForm from './UploadForm'

const get_all_videos_url = base_url + "getAllSegments"
const create_url = base_url + "uploadVideoSegment"
const search_url = base_url + "searchSegments"

/*
const sampleData = [{title: "Vid Title", transcript: "It is illogical", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/Kirk-ItIsIllogical.ogg",
character: "Kirk", isRemote: false, isRemoteAvailable: true}, {title: "Vid2 Title", transcript: "Arg", url: "https://cs3733-indefatigable.s3.us-east-2.amazonaws.com/media/fisher-agh.ogg",
character: "Fisher", isRemote: true, isRemoteAvailable: true}];
*/
class VideoPanel extends React.Component {
    _isMounted = false

    state = {
        videos: [],
        localOnly: false,
        charSearch: "",
        transSearch: "",
        inPlaylistAdd: this.props.inPlaylistAdd,
        puid: this.props.puid,
        getVideosHandler: this.props.getVideosHandler,
        showForm: false
    }

    // These two functions make us promise not to update the state if the component
    // is not mounted.
    componentDidMount() {
        this._isMounted = true
        this.getAllVideos()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    uploadNewSegment = () => {
        this.handleCreateClick()
    }

    searchVideos = () => {
        //console.log("Character: " + this.state.charSearch)
        //console.log("Transcript: " + this.state.transSearch)

        let request = {}
        request["transcript"] = this.state.transSearch
        request["character"] = this.state.charSearch
        //console.log(request)
        let js = JSON.stringify(request)
        //console.log("Request: " + js);
        let xhr = new XMLHttpRequest()
        xhr.open("POST", search_url, true)

        xhr.send(js)

        xhr.onloadend = () => {
            //console.log(xhr);
            //console.log(xhr.request);

            if (xhr.readyState === XMLHttpRequest.DONE) {
                //console.log("XHR:" + xhr.responseText);
                this.processSearchResponse(xhr.responseText)
            } else {
                this.processSearchResponse("N/A")
            }
        }
    }

    processSearchResponse = (res) => {
        if (res === "N/A") {
            console.log("Something went wrong!!!!")
        } else {
            const videos = JSON.parse(res)
            this.setState(videos)
            if (this._isMounted) {
                this.renderVideos()
            }
        }
    }

    getAllVideos = () => {
        axios.get(get_all_videos_url)
            .then((res) => {
                this.setState({
                    videos: res.data.list,
                    showForm: false
            })})
            .then(() => {
                if (this._isMounted) {
                    this.renderVideos()
                }
            })
    }
    renderVideos = () => {
        // Array of JSX videos we want to render.
        let vids = []
        for (let i = 0; i < this.state.videos.length; i++) {
            let currVid = this.state.videos[i]
            // If we are not filtering by local only OR if we are and this is a local video, add it to the array.
            if ((!this.state.localOnly) || (this.state.localOnly && !currVid.isRemote)) {
                vids.push(<li key={currVid.vuid} style={{listStyleType: "none", padding: "5px", float: "left"}}><Video
                    title={currVid.title} url={currVid.url} isRemote={currVid.isRemote}
                    isRemotelyAvailable={currVid.isRemotelyAvailable} id={currVid.vuid} inPlaylistView={false}
                    select={this.state.inPlaylistAdd} puid={this.state.puid}
                /></li>)
            }
        }
        // Return our JSX tags to render.
        return vids

    }

    toggleFilter = () => {
        this.setState({localOnly: !this.state.localOnly})
        this.renderVideos()
    }

    renderVideos = () => {
        // Array of JSX videos we want to render.
        let vids = []
        for (let i = 0; i < this.state.videos.length; i++) {
            let currVid = this.state.videos[i]
            // If we are not filtering by local only OR if we are and this is a local video, add it to the array.
            if ((!this.state.localOnly) || (this.state.localOnly && !currVid.isRemote)) {
                vids.push(<li key={currVid.vuid} style={{listStyleType: "none", padding: "5px", float: "left"}}><Video
                    title={currVid.title} transcript={currVid.transcript} url={currVid.url}
                    character={currVid.character} isRemote={currVid.isRemote}
                    isRemotelyAvailable={currVid.isRemotelyAvailable} id={currVid.vuid} remoteApiID={currVid.remoteApiID}
                    deleteVideoHandler={this.getAllVideos} puid={this.state.puid} select={this.state.inPlaylistAdd} inPlaylistView={false}/></li>)
            }
        }
        // Return our JSX tags to render.
        return vids

    }

    handleCreateClick = (e) => {
        //console.log(this.state);

        var data = {}
        data["title"] = this.state.newVideoTitle
        data["transcript"] = this.state.newVideoTranscript
        data["character"] = this.state.newVideoCharacter

        // base64EncodedValue":"data:text/plain;base64,My4xND....."
        var segments = this.state.newVideoB64.split(',')
        data["video"] = segments[1]  // skip first one

        var js = JSON.stringify(data)
        //console.log("JS:" + js);
        var xhr = new XMLHttpRequest()
        xhr.open("POST", create_url, true)

        // send the collected data as JSON
        xhr.send(js)
        console.log("Sent")

        // This will process results and update HTML as appropriate. 
        xhr.onloadend = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                this.processCreateResponse(xhr.responseText)
            } else {
                this.processCreateResponse("N/A")
            }
        }
    }
    processCreateResponse = (result) => {
        let js = JSON.parse(result)
        let status = js["statusCode"]
        // on success, render playlists again
        //console.log(js);
        if (status === 200) {
            console.log("Created")
            this.getAllVideos()
        } else {
            console.log("Didn't work dude.")
        }
        this.setState({
            newVideoB64: "",
            newVideoCharacter: "",
            newVideoFile: "",
            newVideoTitle: "",
            newVideoTranscript: ""
        })

    }

    encodeFile = (file) => {
        //console.log("File " + file);
        var reader = new FileReader()
        reader.readAsDataURL(file)

        //console.log(reader);
        reader.onload = () => {
            this.setState({newVideoB64: reader.result, needFields: false})
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleVideoChange = (e) => {
        //console.log(e);
        var files = e.target.files
        if (files[0].size > 1000000) {  // make as large or small as you need
            this.setState({newVideoB64: ""})
            alert("File size too large to use:" + files[0].size + " bytes")
        }

        this.encodeFile(files[0])
        this.handleChange(e)
        this.setState({
            needFields: false
        })
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            this.searchVideos()
        }
    }

    renderUploadForm = () => {
        if(this.state.showForm){
            console.log("Rendering form");
            return <div><UploadForm getAllVideosCallback={this.getAllVideos} closeCallback={this.toggleForm}/></div>
        }
        return "";
        
    }
    toggleForm = () => {
        this.setState({
            showForm: !this.state.showForm
        })
        //this.state.showForm ? this.renderUploadForm() : "";
    }
//<input name="newPlaylistName" value={this.state.newPlaylistName} type="text" onChange={e => this.handleChange(e)}></input>
    render() {
        return (
            <div>

                {!this.state.inPlaylistAdd ? <button onClick={this.toggleForm}>Upload new video</button> : ""}
                {!this.state.inPlaylistAdd ? this.renderUploadForm() : ""}
                <br />
                <div>
                    <form>
                        <label style={{display: "inline-block"}}>
                            Search Text:
                            <input type="text" placeholder="Text to search for" onChange={e => this.handleChange(e)}
                                   name="transSearch" onKeyPress={this.handleKeyPress} style={{margin: "5px"}}/>
                            Character:
                            <input type="character" placeholder="Character name" onChange={e => this.handleChange(e)}
                                   name="charSearch" onKeyPress={this.handleKeyPress} style={{margin: "5px"}}/>
                            <button type="button" onClick={this.searchVideos}>Go</button>
                        </label>
                    </form>
                    <p>Local segments only</p>
                    <label className="switch">
                        <input type="checkbox" onClick={this.toggleFilter}></input>
                        <span className="slider round"></span>
                    </label>
                </div>
                <br/>

                {this.renderVideos()}
            </div>)
    }
}

export default VideoPanel

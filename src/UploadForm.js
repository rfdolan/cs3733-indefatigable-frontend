import React from 'react'
import base_url from './api/api.js'
import {FaWindowClose} from "react-icons/fa"
import './style/UploadForm.css'
const create_url = base_url + "uploadVideoSegment"
class UploadForm extends React.Component {
    _isMounted = false;

    state = {
        newVideoTitle: "",
        newVideoCharacter: "",
        newVideoTranscript: "",
        newVideoFile: "",
        newVideoB64: "",
        needFields: true,
    }
    // These two functions make us promise not to update the state if the component
    // is not mounted.
    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }


    handleCreateClick = (e) => {
        this.uploadSegment();
    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter') {
            this.uploadSegment()
        }
    }

    uploadSegment = () => {
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
            this.props.getAllVideosCallback() 
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

    render() {
        //console.log("Rendering");
        return (
            <div className="upload-form">
                <form name="createForm">
                    <br />
                    <FaWindowClose  style = {{float:"right"}} onClick={this.props.closeCallback} />
                    <br />
                    Video Title:<input name="newVideoTitle" type="text" placeholder="Video Title"
                                    value={this.state.newVideoTitle} onChange={e => this.handleChange(e)}
                                    style={{margin: "5px"}}/>
                    <input type="base64Encoding" name="newVideoB64" hidden/><br />
                    Video Character:<input name="newVideoCharacter" value={this.state.newVideoCharacter} type="text"
                                        placeholder="Video Character" onChange={e => this.handleChange(e)}
                                        style={{margin: "5px"}}/><br />
                    Video Transcript:<input name="newVideoTranscript" value={this.state.newVideoTranscript} type="text"
                                            placeholder="Video Transcript" onChange={e => this.handleChange(e)}
                                            style={{margin: "5px"}}/><br />
                    Select a video file: <input name="newVideoFile" type="file"
                                                onChange={e => this.handleVideoChange(e)}
                                                value={this.state.newVideoFile}/><br />
                    <button type="button" onClick={this.handleCreateClick} disabled={this.state.needFields}>Upload new
                        video
                    </button>
                </form>
            </div>
        )
    }
}

export default UploadForm;

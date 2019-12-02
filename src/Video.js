import React from 'react'
import base_url from "./api/api"
import { FaTrashAlt } from 'react-icons/fa';

const delete_url = base_url + 'deleteSegment'

class Video extends React.Component {
    state = {
        title: this.props.title,
        transcript: this.props.transcript,
        url: this.props.url,
        character: this.props.character,
        isRemote: this.props.isRemote,
        isRemotelyAvailable: this.props.isRemotelyAvailable,
        id: this.props.id,
    }

    deleteVideo = () => {
        if (window.confirm('Are you sure')) {
            let data = {}
            data["vuid"] = this.props.id
            let js = JSON.stringify(data)
            let xhr = new XMLHttpRequest()
            xhr.open("POST", delete_url, true)
            xhr.send(js)
            xhr.onloadend = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    this.processDeleteResponse(this.state.id, xhr.responseText)
                } else {
                    this.processDeleteResponse(this.state.id, "N/A")
                }
            }
        }
    }

    processDeleteResponse = (vuid, reuslt) => {
        let js = JSON.parse(reuslt);
        let status = js["statusCode"];
        if(status === 200) {
            console.log("Deleted");
            this.props.deleteVideoHandler();
        }else{
            console.log("Video couldn't be deleted.")
        }
    }

    render() {
        return (
            <div style={{padding: "10px", maxWidth: "325px", backgroundColor: "#3ed2e6", borderRadius: "25px"}}>
                <FaTrashAlt style={{float: "right"}} onClick={this.deleteVideo}/>
                <h3>{this.state.title}</h3>
                <h4>Character: {this.state.character}</h4>
                <h4>Transcript: {this.state.transcript}</h4>
                <video display="block" margin="0 auto" src={this.state.url} width="320" height="240"
                       style={{borderRadius: "25px"}} controls>Your browser does not support this video.
                </video>
            </div>
        )
    }
}

export default Video
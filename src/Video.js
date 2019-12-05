import React from 'react'
import base_url from "./api/api"
import {FaTrashAlt} from 'react-icons/fa'

const delete_url = base_url + 'deleteSegment'
const delete_from_playlist_url = base_url + 'deleteSegmentFromPlaylist'
const add_to_playlist_url = base_url + 'appendSegmentToPlaylist'

class Video extends React.Component {
    state = {
        title: this.props.title,
        transcript: this.props.transcript,
        url: this.props.url,
        character: this.props.character,
        isRemote: this.props.isRemote,
        isRemotelyAvailable: this.props.isRemotelyAvailable,
        id: this.props.id,
        inPlaylistView: this.props.inPlaylistView,
        inSelectView: this.props.select,
        puid: this.props.puid
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
        let js = JSON.parse(reuslt)
        let status = js["statusCode"]
        if (status === 200) {
            console.log("Deleted")
            this.props.deleteVideoHandler()
        } else {
            console.log("Video couldn't be deleted.")
        }
    }

    deleteVideoFromPlaylist = () => {
        if (window.confirm("Deleting video " + this.state.id + " from playlist " + this.state.puid)) {
            let data = {}
            data["vuid"] = this.props.id
            data["puid"] = this.state.puid
            let js = JSON.stringify(data)
            let xhr = new XMLHttpRequest()
            xhr.open("POST", delete_from_playlist_url, true)
            xhr.send(js)
            xhr.onloadend = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log("deleted successfully")
                } else {
                    console.log("error in deleting video")
                }
            }
        }
    }

    addVideoToPlaylist = () => {
        if (window.confirm("Adding video " + this.state.id + " to playlist " + this.state.puid)) {
            let data = {}
            data["vuid"] = this.props.id
            data["puid"] = this.state.puid
            let js = JSON.stringify(data)
            let xhr = new XMLHttpRequest()
            xhr.open("POST", add_to_playlist_url, true)
            xhr.send(js)
            xhr.onloadend = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    console.log("added successfully")
                } else {
                    console.log("error in adding video")
                }
            }
        }
    }

    render() {
        return (
            <div style={{padding: "10px", maxWidth: "325px", backgroundColor: "#3ed2e6", borderRadius: "25px"}}>
                {!this.state.inSelectView ? <div>
                    {!this.state.inPlaylistView ? <FaTrashAlt style={{float: "right"}} onClick={this.deleteVideo}/>
                        : <FaTrashAlt style={{float: "right"}} onClick={this.deleteVideoFromPlaylist}/>}
                </div> : ''}
                <h3>{this.state.title}</h3>
                {typeof (this.state.character) != 'undefined' ? <h4>Character: {this.state.character}</h4> : ''}
                {typeof (this.state.character) != 'undefined' ? <h4>Transcript: {this.state.transcript}</h4> : ''}
                <video display="block" margin="0 auto" src={this.state.url} width="320" height="240"
                       style={{borderRadius: "25px"}} controls>Your browser does not support this video.
                </video>
                <div style={{textAlign: "center"}}>
                    {this.props.select ? <button onClick={this.addVideoToPlaylist}>Add Video</button> : ''}
                </div>
            </div>
        )
    }
}

export default Video
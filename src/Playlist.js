import React from 'react'
import base_url from './api/api.js'
import {FaTrashAlt, FaPlayCircle, FaWindowClose, FaPlusCircle, FaMinusCircle} from 'react-icons/fa'
import Video from "./Video"
import VideoPanel from "./VideoPanel"
import PlaylistPanel from "./PlaylistPanel"
import SelectVideo from "./SelectVideo"

const delete_url = base_url + 'deletePlaylist'

class Playlist extends React.Component {
    state = {
        title: this.props.title,
        videos: this.props.videos,
        id: this.props.id,
        opened: false,
        showVideoSelection: false
    }

    deletePlaylist = () => {
        if (window.confirm('Are you sure')) {
            let data = {}
            data["puid"] = this.props.id
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

    processDeleteResponse = (puid, result) => {
        let js = JSON.parse(result)

        let status = js["statusCode"]

        if (status === 200) {
            console.log("Deleted")
            this.props.deletePlaylistHandler()
        } else {
            console.log("Didn't work big guy.")
        }

    }

    processClick = () => {
        this.setState(prevState => ({
            opened: !prevState.opened
        }))
    }

    addVideos = () => {
        this.setState(prevState => ({
            showVideoSelection: !prevState.showVideoSelection
        }))
    }

    getVideos = () => {
        let list = []
        for (let i = 0; i < this.state.videos.length; i++) {
            let currVideo = this.state.videos[i]
            list.push(<Video title={currVideo.title} url={currVideo.url} inPlaylistView={true} puid={this.state.id}
                             id={currVideo.vuid}/>)
        }
        return list
    }

    render() {
        return (
            <div style={{
                padding: "10px",
                maxWidth: "325px",
                backgroundColor: "#399e5a",
                borderRadius: "25px",
                margin: "5px"
            }}>
                <FaTrashAlt style={{float: "right"}} onClick={this.deletePlaylist}/>
                <h3>{this.state.title}</h3>
                {this.state.videos.length > 0 && this.state.opened === false ?
                    <FaPlayCircle style={{float: "right", marginLeft: "5px"}} onClick={this.processClick}/> : ''}
                {this.state.opened ?
                    <FaWindowClose style={{float: "right", marginLeft: "5px"}} onClick={this.processClick}/> : ''}
                {!this.state.showVideoSelection ? <FaPlusCircle style={{float: "right"}} onClick={this.addVideos}/> :
                    <FaMinusCircle style={{float: "right"}} onClick={this.addVideos}/>}
                <br/>
                <div>{this.state.opened ? this.getVideos() : ''}</div>
                <div>{this.state.showVideoSelection ? <SelectVideo puid={this.state.id}/> : ''}</div>
            </div>
        )
    }
}

export default Playlist
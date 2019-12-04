import React from 'react'
import Playlist from './Playlist.js'
import axios from 'axios'
import base_url from './api/api.js'


const get_all_playlists_url = base_url + 'getAllPlaylists'
const create_url = base_url + 'createPlaylist'

class PlaylistPanel extends React.Component {
    _isMounted = false

    state = {
        playlists: [],
        newPlaylistName: "",
    }

    // These two functions make us promise not to update the state if the component
    // is not mounted.
    componentDidMount() {
        this._isMounted = true
        this.getAllPlaylists()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    createNewPlaylist = (e) => {
        e.preventDefault()
        let data = {}
        data["name"] = this.state.newPlaylistName
        let js = JSON.stringify(data)
        //console.log("Request: " + js);
        // Do api call
        let xhr = new XMLHttpRequest()
        xhr.open("POST", create_url, true)

        xhr.send(js)

        xhr.onloadend = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                this.processCreateResponse(xhr.responseText)
            } else {
                this.processCreateResponse("N/A")
            }
        }

        // reset this.state.name to ""
        //console.log("You want to create a new playlist don't you squidward.");
    }
    processCreateResponse = (result) => {
        let js = JSON.parse(result)
        let status = js["statusCode"]
        // on success, render playlists again
        if (status === 200) {
            console.log("Created")
            this.getAllPlaylists()

        } else {
            console.log("Didn't work dude.")
        }
        this.setState({newPlaylistName: ""})

    }


    getAllPlaylists = () => {
        //console.log("Gettin' em");
        axios.get(get_all_playlists_url)
            .then((res) => {  /*console.log(res);*/
                this.setState({playlists: res.data.playlists})
            })
            .then(() => {
                if (this._isMounted) {
                    this.renderPlaylists()
                }
            })
    }

    renderPlaylists = () => {
        // Array of JSX playlists we want to render.
        let list = []
        for (let i = 0; i < this.state.playlists.length; i++) {
            let currPlaylist = this.state.playlists[i]
            list.push(<li key={currPlaylist.ID} style={{listStyleType: "none", adding: "5px", float: "left"}}>
                <Playlist title={currPlaylist.name} videos={currPlaylist.videos} id={currPlaylist.ID}
                          deletePlaylistHandler={this.getAllPlaylists}></Playlist></li>)

        }
        // Return our JSX tags to render.
        return list

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <div>
                <label>New Playlist Name:
                    <input name="newPlaylistName" value={this.state.newPlaylistName} type="text"
                           onChange={e => this.handleChange(e)}></input>
                </label>
                <button type="button" onClick={(e) => this.createNewPlaylist(e)}>Create new playlist</button>
                <br/>
                <br/>
                {this.renderPlaylists()}
            </div>
        )
    }
}

export default PlaylistPanel
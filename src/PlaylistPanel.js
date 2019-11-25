import React from 'react'
import Playlist from './Playlist.js'
import axios from 'axios'
import base_url from './api/api.js'


const get_all_playlists_url = base_url + 'getAllPlaylists'
class PlaylistPanel extends React.Component {
    _isMounted = false;

    state = {
        playlists: [],
    }
    
    // These two functions make us promise not to update the state if the component
    // is not mounted.
    componentDidMount() {
        this._isMounted = true;
        this.getAllPlaylists();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    createNewPlaylist = () =>{
        console.log("You want to create a new playlist don't you squidward.");
    }

    
    getAllPlaylists = () => {
        console.log("Gettin' em");
        axios.get(get_all_playlists_url)
        .then((res) => {  console.log(res);  this.setState( { playlists: res.data.playlists })})
        .then(() => {if(this._isMounted) {this.renderPlaylists()}});
    }

    renderPlaylists = () => {
        // Array of JSX playlists we want to render.
        let list = [];
        for(let i=0; i<this.state.playlists.length; i++ ) {
            let currPlaylist = this.state.playlists[i];
            list.push(<li key={currPlaylist.ID} style={{listStyleType: "none", adding: "5px", float: "left"}}>
                <Playlist title={currPlaylist.name} videos={currPlaylist.videos} id={currPlaylist.ID} deletePlaylistHandler={this.getAllPlaylists}></Playlist></li>);

        }
        // Return our JSX tags to render.
        return list;

    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.createNewPlaylist}>Create new playlist</button><br />
                <br />
                {this.renderPlaylists()}
            </div>
        );
    }
}

export default PlaylistPanel;
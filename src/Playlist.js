import React from 'react'
import base_url from './api/api.js'

const delete_url = base_url + 'deletePlaylist'
class Playlist extends React.Component {
    state = {
        title: this.props.title,
        videos: this.props.videos,
        id: this.props.id,
    }

    deletePlaylist = () => {
        if(window.confirm('Are you sure')) {
            let data = {};
            data["puid"] = this.props.id;
            let js = JSON.stringify(data);
            //console.log("Request: " + js);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", delete_url, true);

            xhr.send(js);
            
            xhr.onloadend = () => {
                //console.log(xhr);
                //console.log(xhr.request);

                if(xhr.readyState === XMLHttpRequest.DONE) {
                    //console.log("XHR:" + xhr.responseText);
                    this.processDeleteResponse(this.state.id, xhr.responseText);
                }
                else {
                    this.processDeleteResponse(this.state.id, "N/A");
                }
            }
            //axios.post(delete_url).then((res) => {console.log(res)})
            /*
            axios.post(delete_url, {
                
                params: {
                    puid: this.state.id
                }
            })/*.then((res) => {console.log(res)});*/
            
        }

    }

    processDeleteResponse = (puid, result) => {
        //console.log("result:" + result);
        let js = JSON.parse(result);

        let status = js["statusCode"];

        if(status === 200) {
            console.log("Deleted");
            this.props.deletePlaylistHandler();
        }
        else {
            console.log("Didn't work big guy.");
        }

    }

    render() {
        return (
            <div style={{padding:"10px", maxWidth:"325px", backgroundColor: "#399e5a", borderRadius: "25px", margin:"5px" }}>
                <h3>{this.state.title}</h3>
                <button onClick={this.deletePlaylist}>Delete</button>
            </div>
        )
    }
}

export default Playlist;
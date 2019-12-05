import React from 'react'
import Video from './Video'
import axios from 'axios'
import './style/VideoPanel.css'
import base_url from './api/api.js'

const get_all_videos_url = base_url + "getAllSegments"

class SelectVideo extends React.Component {
    _isMounted = false

    state = {
        videos: [],
        localOnly: false,
        puid: this.props.puid
    }

    componentDidMount() {
        this._isMounted = true
        this.getAllVideos()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getAllVideos = () => {
        axios.get(get_all_videos_url)
            .then((res) => {
                this.setState({videos: res.data.list})
            })
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
                    select={true} puid={this.state.puid}/></li>)
            }
        }
        // Return our JSX tags to render.
        return vids

    }

    render() {
        return (
            <div>
                {this.renderVideos()}
            </div>
        )
    }
}

export default SelectVideo

import React from 'react'

class Playlist extends React.Component {
    state = {
        title: this.props.title,
        videos: this.props.videos,
        id: this.props.id,
    }
    render() {
        return (
            <div style={{padding:"10px", maxWidth:"325px", backgroundColor: "#399e5a", borderRadius: "25px" }}>
                <h3>{this.state.title}</h3>
                <button onClick={this.deletePlaylist}>Delete</button>
            </div>
        )
    }
}

export default Playlist;
import React from 'react'

class Video extends React.Component {

    state = {
        title:this.props.title,
        transcript:this.props.transcript,
        url:this.props.url,
        character: this.props.character,
        isRemote: this.props.isRemote,
        isRemotelyAvailable: this.props.isRemotelyAvailable,
        id: this.props.id,
    }
    render() {
        return (
            <div style={{padding:"10px", maxWidth:"325px", backgroundColor: "#3ed2e6", borderRadius: "25px" }}>
                <h3>{this.state.title}</h3>
                <h4>Character: {this.state.character}</h4>
                <h4>Transcript: {this.state.transcript}</h4>
                <video display="block" margin="0 auto" src={this.state.url} width="320" height="240" style={{borderRadius: "25px"}} controls>Your browser does not support this video.</video>
            </div>
        );
    }
}

export default Video;
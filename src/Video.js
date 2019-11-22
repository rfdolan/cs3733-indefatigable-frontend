import React from 'react'

class Video extends React.Component {

    state = {
        title:this.props.title,
        transcript:this.props.transcript,
        url:this.props.url,
        character: this.props.character,
        isRemote: this.props.isRemote,
        isRemotelyAvailable: this.props.isRemotelyAvailable,
    }
    render() {
        return (
            <div style={{padding:"10px", border:"3px solid red", maxWidth:"400px" }}>
                <h3>{this.state.title}</h3>
                <h4>Character: {this.state.character}</h4>
                <h4>Transcript: {this.state.transcript}</h4>
                <video src={this.state.url} width="320" height="240" controls>Your browser does not support this video.</video>
            </div>
        );
    }
}

export default Video;
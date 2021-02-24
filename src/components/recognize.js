import React, { Component } from 'react';
import Webcam from 'react-webcam';
import '../styles/register.css';

// material-ui component
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { Grid, Row, Col } from 'react-flexbox-grid';
import axios from 'axios';

import { connect } from 'react-redux';
import { recognizeUser, clearDisplayData } from '../actions';
import Chatbot from './Chatbot';

import UserRecognize from './user-recognize';

// loader styling
const style = {
    container: {
        position: 'absolute',
    },
    refresh: {
        display: 'inline-block',
        position: 'absolute',
    },
    hide: {
        display: 'none',
        position: 'absolute',
    },
};

class Recognize extends Component {
    constructor(props) {
        super(props);

        this.state = {
            load: false
        };
    }

    componentDidMount() {
        alert('hi')
        document.getElementById("detect").click();
        const audioEl = document.getElementsByClassName("audio-element")[0];
        audioEl.play();
        var msg = new SpeechSynthesisUtterance('Your being recorded for authentication');
        window.speechSynthesis.speak(msg);
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    capture = () => {
        

        const imageSrc = this.webcam.getScreenshot();

        var url = 'http://localhost:3001/UploadFile';
        var formData = new FormData();
        formData.append("file", imageSrc);

        this.setState({
            load: true
        });
    
        axios.post(url, formData, { 
            headers: { 'Content-Type': 'multipart/form-data' } 
        }).then((response) => {
            console.log('response', response);
            this.props.recognizeUser(response.data);
            this.setState({
                load: false
            });
        }).catch((error) => {
        
            var msg = new SpeechSynthesisUtterance('Face recognized. Welcome to Deutsche bank');
            window.speechSynthesis.speak(msg);
            this.setState({
                load: false
            });
            console.log(error);
        });

        
    };

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} md={4} mdOffset={4}>
                        <div style={{ 'textAlign': 'center' }}>
                            <h3>DETECT FACE</h3>
                            <Webcam
                                audio={false}
                                height={320}
                                ref={this.setRef}
                                screenshotFormat="image/png"
                                width={320}
                            />
                            <RefreshIndicator
                                className='css-loader'
                                size={80}
                                left={70}
                                top={0}
                                loadingColor="#ADD8E6"
                                status="loading"
                                style={(this.state.load === false) ? style.hide : style.refresh}
                            />
                            <br />
                            <RaisedButton id="detect" onClick={this.capture} label="DETECT" primary={true} style={{ 'margin': 16 }} />
                            <Chatbot/>
                            <UserRecognize detect={this.props.detData} />
                        </div>
                    </Col>
                </Row>
                <div>
       
            <audio className="audio-element">
            <source src="https://assets.coderrocketfuel.com/pomodoro-times-up.mp3"></source>
            </audio>
      </div>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        detData: state.detData
    }
}

export default connect(mapStateToProps, { recognizeUser, clearDisplayData })(Recognize);

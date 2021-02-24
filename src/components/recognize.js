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
        document.getElementById("detect").click();
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    capture = () => {
        // this.setState({
        //     load: true
        // });

        const imageSrc = this.webcam.getScreenshot();

        var url = 'http://localhost:3001/UploadFile';
        var formData = new FormData();
        formData.append("file", imageSrc);
    
        axios.post(url, formData, { 
            headers: { 'Content-Type': 'multipart/form-data' } 
        }).then((response) => {
            console.log('response', response);
            this.props.recognizeUser(response.data);
            this.setState({
                load: false
            });
        }).catch((error) => {
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
                                height={520}
                                ref={this.setRef}
                                screenshotFormat="image/png"
                                width={520}
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
                            <UserRecognize detect={this.props.detData} />
                        </div>
                    </Col>
                </Row>
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

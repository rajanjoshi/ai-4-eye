import React, { Component } from 'react';
import Webcam from 'react-webcam';
import '../styles/register.css';

import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { connect } from 'react-redux';
import { registerUser, clearDisplayData } from '../actions';

import UserRegister from './user-register';

// material-ui components
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

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

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            load: false
        };
    }

    componentDidMount() {
        this.props.clearDisplayData();
    }

    setRef = (webcam) => {
        this.webcam = webcam;
    }

    capture = () => {

        if (this.state.username === '' || this.state.username === ' ') {
            alert('Username cannot be empty');
            return;
        }

        this.setState({
            load: true
        });

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

    }


    handleUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} md={4} mdOffset={4}>
                        <div style={{ 'textAlign': 'center' }}>
                            <h3>REGISTER FACE</h3>
                            <Webcam
                                audio={false}
                                height={320}
                                ref={this.setRef}
                                screenshotFormat="image/png"
                                width={320}
                            />
                            <br />
                            <div style={{ 'margin': '0 auto!important' }}>
                                <TextField
                                    hintText="provide identification name"
                                    floatingLabelText="Username"
                                    onChange={(event) => this.handleUsername(event)}
                                />
                            </div>
                            <br />
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
                            <RaisedButton className='register-button' onClick={this.capture} label="REGISTER" primary={true} style={{ 'margin': 16 }} />
                            <UserRegister detect={this.props.regData} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        regData: state.regData
    }
}

export default connect(mapStateToProps, { registerUser, clearDisplayData })(Register);

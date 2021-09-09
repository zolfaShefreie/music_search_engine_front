import React, { Component } from 'react'
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import axios from "axios";
import ReactPlayer from 'react-player/youtube'

import LoadingImg from "./loading2.gif"

class App extends Component {
  constructor(props) {
    super(props)
    this.url = "http://127.0.0.1:8000/search/"
    this.state = {
      recordState: null,
      showLoading: false,
      showResult: false,
      showRecorder: true,
      noResult: false,
      btnStart: true,
      btnActive: true,
      title: "title",
      author: "author",
      averageRating: 5,
      viewCount: "12321231",
      thumbnail: "",
      url: "",
    }
    this.handleRecord = this.handleRecord.bind(this)
  }

  async handleRecord(event){
    var btnState = this.state.btnStart;
    if (btnState){
      await this.setState({
        recordState: RecordState.START
      })
      await this.setState({btnStart: !btnState, btnActive: false})
      setTimeout(() => {this.setState({btnActive: true})}, 5000);
      setTimeout(() =>{this.setState({recordState: RecordState.STOP})}, 15000)
    }else{
      await this.setState({
        recordState: RecordState.STOP
      })

    }
  }

  start = () => {
    this.setState({
      recordState: RecordState.START
    })
  }

  stop = () => {
    this.setState({
      recordState: RecordState.STOP
    })
  }

  onStop = async (audioData) => {
    // console.log('audioData', audioData.blob.size)
    var file = new File([audioData.blob], "alaki.wav");
    console.log(file)
    await this.setState({showLoading: true, showRecorder:false})
    const formData = new FormData();
    formData.append("file_query", file);
    await axios.post(`${this.url}`, formData).then((response) => {
      this.setState(response.data)
      this.setState({showLoading: false, showResult: true})
    }, (error) => {
      // console.log(error);
      this.setState({noResult: true, showResult: true})
    });
  }

  render() {
    const { recordState } = this.state

    return (
        <div className="container" style={{color: "#000000"}}>
          {
            this.state.showLoading &&
            <div className="box">
              <img src={LoadingImg} className="justify-content-evenly" width="70%" height="70%"/>
            </div>
          }
          {
            this.state.showRecorder &&
            <div className="box_result">
              <h2 className="header_style">Echo Searcher</h2>
              <AudioReactRecorder
                  state={recordState}
                  onStop={this.onStop}
                  backgroundColor="#000000"
                  foregroundColor="#ced4da"
                  canvasHeight="150"
              />
              {
                this.state.btnStart &&
                <button className={this.state.btnActive? "btn button_blue" : "btn button_inactive"}
                        onClick={this.handleRecord} disabled={!this.state.btnActive}>Start</button>
              }
              {
                ! this.state.btnStart &&
                <button className={this.state.btnActive? "btn button_blue" : "btn button_inactive"}
                        onClick={this.handleRecord} disabled={!this.state.btnActive}>Stop</button>
              }
            </div>
          }
          {
            (this.state.showResult & !this.state.noResult) &&
            <div className="box_result">
              <div className="col">
                {/*<img src={this.state.thumbnail}/>*/}
                <ReactPlayer url={this.state.url} controls={true}/>
                <h2 className="row header_style" style={{color: "#e9ecef", paddingLeft:"5%"}}>{this.state.title}</h2>
                <h5 className="row" style={{color: "#ced4da", paddingLeft:"5%"}}>  Artist: {this.state.author}</h5>
                <br/>
                <div className="row">
                  <div className="col">
                    <h6 style={{color: "#adb5bd"}}>View: {this.state.viewCount}</h6>
                  </div>
                  <div className="col">
                    <h6 style={{color: "#adb5bd"}}>Rate: {this.state.averageRating}</h6>
                  </div>
                </div>
              </div>
            </div>
          }
          {
            (this.state.showResult & this.state.noResult) &&
            <div className="box_result">
              <h4 className="header_style">No music similar to input voice was found</h4>
            </div>
          }
        </div>
    )
  }
}

export default App;
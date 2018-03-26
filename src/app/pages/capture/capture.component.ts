import { Component, OnInit } from '@angular/core';


declare var MediaRecorder: any;
declare var window : any;
 

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss',
  '../../app.component.scss']
})



export class CaptureComponent implements OnInit  {

  constructor() { }

  constraints = { 
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 } 
    } 
    };
  chunks = [];

  mediaRecorder : any;

  audioDevices = [];
  videoDevices = [];

  videoDeviceSelected : any;

  currentPrc : number = 1; 

  requestId : any;

  // test for interval 
  myVar : any; 

  public collections = [
    {  
      "collectionId" : 1,
      "collectionIsSelected" : true,
      "collectionTitle" : "#Wedding-dresses",
      "imgPath" : "../../assets/img/1.jpg", 
      "dateDay" : "07", 
      "dateMonth" : "mar", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "collectionId" : 2,
      "collectionIsSelected" : false,
      "collectionTitle" : "#CasualMine",
      "imgPath" : "../../assets/img/2.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {"collectionId" : 3,
      "collectionIsSelected" : false,
      "collectionTitle" : "#OfficeVibes",
      "imgPath" : "../../assets/img/3.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {"collectionId" : 4,
      "collectionIsSelected" :false,
      "collectionTitle" : "#Promnight",
      "imgPath" : "../../assets/img/6.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    }
  ]
  

  ngOnInit() {

        navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this)).catch(this.handleError);

  }


  collectionSelected ( collection ){
    let selectedCollectionId = collection.collectionId; 

    for (var i  = 0 ; i<this.collections.length; i++){
      if (this.collections[i].collectionId == selectedCollectionId){
        this.collections[i].collectionIsSelected = true; 
      }else{
        this.collections[i].collectionIsSelected = false; 
      }
    }

  }


  handleError(err){

      console.log('The following error occured: ' + err);
    
  }

  gotDevices(deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];

      var option = {
        "deviceId" : deviceInfo.deviceId
      };
 
      if (deviceInfo.kind === 'audioinput') {
        option["text"] = deviceInfo.label ||
          'microphone ' + (this.audioDevices.length + 1);
        this.audioDevices.push(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option["text"]  = deviceInfo.label || 'camera ' +
          (this.videoDevices.length + 1);
        if (!this.videoDeviceSelected){
          this.videoDeviceSelected = option; 
        }
        this.videoDevices.push(option);
      } else {
        console.log('Found one other kind of source/device: ', deviceInfo);
      }
    }

    // this.getStream();
  }

  getStream() {

    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    this.constraints.video["deviceId"] = {exact: this.videoDeviceSelected.deviceId};

    navigator.mediaDevices.getUserMedia(this.constraints).
      then(this.gotStream.bind(this)).catch(this.handleError);
  }


  gotStream(stream) {



    let comp = this; 

    window["stream"] = stream; // make stream available to console

    var videoElement = document.getElementById('captureVideo')  as HTMLVideoElement;
    videoElement.srcObject = stream;

    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.onstop = function(e) {
    
      var blob = new Blob(comp.chunks, { 'type' : 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' });
      comp.chunks.length = 0; 

      var videoCapture : any = document.getElementById("captureVideo");

      var videoOut : any = document.getElementById("outVideo");

      var videoURL = window.URL.createObjectURL(blob);
      videoOut.src = videoURL;

      videoOut.onloadedmetadata = function(e) {
        console.log("meta loaded")
        videoOut.play();
        videoOut.muted = 'true';
     };


      console.log("recorder stopped");

      window.stream.getTracks()[0].stop()

      console.log("stream stopped...");

      videoOut.hidden = false; 
      videoCapture.hidden = true;

    }

    this.mediaRecorder.ondataavailable = function(e) {
      comp.chunks.push(e.data);
      console.log("data is being pushed...")
    }
  }




  startRecord(){
    console.log("starting recording..."); 

    this.mediaRecorder.start();
    console.log(this.mediaRecorder.state);

  }

  stopRecord(){
    this.mediaRecorder.stop();
    console.log(this.mediaRecorder.state);

  }

  changeNewSessionSlider(evt){
    this.currentPrc = evt.value;

    
    this.setVideoTime();
    

  }

  setVideoTime(){


    let comp = this;
    const outVideo : any = document.getElementById("outVideo");

    outVideo.pause(); 

    let newTime = parseFloat(((comp.currentPrc / 100) * outVideo.duration).toFixed(3));

    console.log(newTime);

    if (outVideo.currentTime != newTime){
      outVideo.currentTime = newTime;
     
    }

     // comp.requestId = requestAnimationFrame(this.setVideoTime.bind(this));

  }

  stopSlide(){
    let comp = this;
    const outVideo : any = document.getElementById("outVideo");

    outVideo.pause(); 
    
    let newTime = parseFloat(((comp.currentPrc / 100) * outVideo.duration).toFixed(2));

    console.log(newTime);

    if (outVideo.currentTime != newTime){
      outVideo.currentTime = newTime;
     
    }

     // comp.requestId = requestAnimationFrame(this.setVideoTime.bind(this));
  }


  testInterval(){

    let comp = this; 

    this.myVar = setInterval(function(){
      const outVideo : any = document.getElementById("outVideo");
      if (comp.currentPrc < 100){

       let newTime = parseFloat(((comp.currentPrc / 100) * outVideo.duration).toFixed(2));
       outVideo.currentTime = newTime;

       comp.currentPrc++;

      }else{
          comp.currentPrc = 1;
      }
      
    }, 100);


  }

  



}

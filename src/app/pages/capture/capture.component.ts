import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';


import { DomSanitizer } from '@angular/platform-browser';

declare var MediaRecorder: any;
declare var window : any;
 

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss',
  '../../app.component.scss']
})



export class CaptureComponent implements OnInit  {

  constructor(public san : DomSanitizer, private ref: ChangeDetectorRef) { }

  captureMode = {
    mode : 0,  // 1 = upload, 2 = capture
    type : 0, // 1 = image, 2 = video
    src : ""
  }


  captureContainerHidden = false; 
  captureVideoHidden = true;
  previewVideoHidden = true;
  previewImgHidden = true;



  previewItems = [];


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

  /**
   * Set the capture mode of adding a new session 
   * @param mode  1 = upload, 2 = capture
   * @param type  1 = image, 2 = video
   */
  setCaptureMode ( mode, type ) {

    this.captureMode.mode = mode;
    this.captureMode.type = type;


  }

  addPreviewItem(src, type){

    let newItem = {
      "createdAt" : new Date(), 
      "srcThumbnail" : src, 
      "type" : type
    }

    this.previewItems.push(newItem);
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


  selectCapture(){

    this.setCaptureMode(2,2);

    this.captureContainerHidden = true; 
    this.captureVideoHidden = false;
    this.previewVideoHidden = true;
    this.previewImgHidden = true;

    this.getStream();
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

    

  }

  setStepHidden(step){

    if (step == 1){

      this.captureContainerHidden = true; 
      this.captureVideoHidden = true;
      this.previewVideoHidden = true;
      this.previewImgHidden = true;



    }


  }

  /* file drag and drop */ 


  public files: UploadFile[] = [];
 
  public dropped(event: UploadEvent) {
    this.files = event.files;

    let comp = this; 

    
    this.captureContainerHidden = true; 
    this.previewImgHidden = false;

    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          
         let preview = document.getElementById("previewImg") as any; 

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          
          const reader  = new FileReader();


          reader.onloadend = function () {
            comp.setCaptureMode(1,1);

            comp.addPreviewItem(reader.result, 1);

            comp.previewImgHidden = false;

            preview.src = reader.result;

            console.log("dne");
            console.log(comp);

            comp.ref.detectChanges();

            console.log("detect changes...")
            
          
          }
         
          if (file) {
           reader.readAsDataURL(file);
          }

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)
 
          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })
 
          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }


  selectPreviewItem(item){

    console.log(item);


  }


  takePicture(){
    console.log("takePic");
  }

  takeVideo(){

    console.log("takeVid");
  }



}

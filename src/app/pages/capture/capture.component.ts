import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { AddCollectionComponent } from '../../comp/add-collection/add-collection.component';

import { DomSanitizer } from '@angular/platform-browser';
import { NgZone } from '@angular/core';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { forEach } from '@angular/router/src/utils/collection';

import { MatDialog } from '@angular/material';
import { CommentDialogComponent } from '../../comp/comment-dialog/comment-dialog.component'
import { NotificationsService } from 'angular2-notifications';
import { ApiService } from '../../services/api.service';
import { AuthenticationService } from '../../services/auth.service';
import { Collection } from '../../models/datamodel';

declare var MediaRecorder: any;
declare var window : any;

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.scss',
  '../../app.component.scss']
})

export class CaptureComponent implements OnInit  {

  constructor(
    public san : DomSanitizer, 
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private spinnerService: Ng4LoadingSpinnerService,
    private dialog : MatDialog,
    private _service: NotificationsService, 
    private api: ApiService, 
    private auth: AuthenticationService
  
  ) { }

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

  selectedPreviewItem : any = {
    srcThumbnail : "", 
    newTags : []
  }

  selectedPreviewItemIndex : number = 0;

  constraints = { 
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 } 
    } 
    };

  tmpPictureTaken : any; 

  chunks = [];

  mediaRecorder : any;

  audioDevices = [];
  videoDevices = [];

  videoDeviceSelected : any;

  collectionList : Collection[] = []; 

  selectedCollection : any; 

  currentPrc : number = 1; 

  requestId : any;

  // test variables 
  myVar : any; 

  testFiles = [];


  ngOnInit() {

    this.loadCollections();

    // dragType 1 = purchase tag, 2 = comment
    this.dragElement(document.getElementById(("addTag")), 1);      

    navigator.mediaDevices.enumerateDevices().then(this.gotDevices.bind(this)).catch(this.handleError);
    // window.requestAnimationFrame(this.slideFrame.bind(this));
  }


  loadCollections(){

    let userId = this.auth.getUserId();


       this.api.loadRoom(userId).subscribe(
      (data) => {
        
        try{

          let outData = data.map(function(val){
            let tmpCollection = new Collection(val);
            tmpCollection.castSessions();

            return tmpCollection;

          })

        this.collectionList = outData;

        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.api.handleAPIError(error);
      }
    )
   
  }

  addCollection(){

		let comp = this; 

    let dialog = this.dialog.open(AddCollectionComponent, {
        data: { collection: "dropCoords" }
    });
  
    dialog.afterClosed()
      .subscribe(collection => {
        if (collection) {
          this.loadCollections()
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  collectionChange (event){

    if (event.value == -1){
      this.addCollection();
    }
  }
  


  selectCapture(){

    this.setCaptureMode(2,2);

    this.setStepHidden(2);

    this.getStream();
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

  addPreviewItem(thumbnailSrc, src, type, originalName){

    let newItem = {
      "createdAt" : new Date(), 
      "srcThumbnail" : thumbnailSrc,
      "src" : src,
      "type" : type, 
      "newTags" : [], 
      "originalName" : originalName
    }

    this.previewItems.push(newItem);

    this.ref.detectChanges();
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

    this.spinnerService.show();


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

    var videoElement : any = document.getElementById('captureVideo') ;
    var videoElementHidden : any = document.getElementById('captureVideoHidden') ;

    videoElementHidden.srcObject = stream;
    videoElementHidden.play();


    videoElement.srcObject = stream;
    videoElement.play();

    this.spinnerService.hide();


    this.mediaRecorder = new MediaRecorder(stream);
    
    this.mediaRecorder.onstop = function(e) {
    
      var blob = new Blob(comp.chunks, { 'type' : 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' });
      comp.chunks.length = 0; 

      var videoCapture : any = document.getElementById("captureVideo");
      
      var videoOut : any = document.getElementById("previewVideo");

      var videoURL = window.URL.createObjectURL(blob);
      //videoOut.src = videoURL;

      let fileName = Date.now() + "_video.mp4";

      comp.addPreviewItem(comp.tmpPictureTaken, videoURL, 'video/mp4', fileName);

      videoOut.onloadedmetadata = function(e) {
        console.log("meta loaded")
        //videoOut.play();
        //videoOut.muted = 'true';
     };


     


      console.log("recorder stopped");

      window.stream.getTracks()[0].stop();

      console.log("stream stopped...");

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

    

  }

  setStepHidden(step){

    this.captureContainerHidden = true; 
    this.captureVideoHidden = true;
    this.previewVideoHidden = true;
    this.previewImgHidden = true;

    if (step == 1){
      this.captureContainerHidden = false;
    }

    // live preview of camera to await action
    if (step == 2){

      this.captureVideoHidden = false;

    }

    // preview of uploaded image
    if (step == 3){

      this.previewImgHidden = false;

      if (window.stream){
        window.stream.getTracks()[0].stop();
      }
      
    }

    // preview of uploaded video
    if (step == 4){
      this.previewVideoHidden = false;
    }




  }

  /* file drag and drop */ 


  public files: UploadFile[] = [];
 
  public dropped(event: UploadEvent) {
    this.files = event.files;

    let comp = this; 

    for (const droppedFile of event.files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          
         let preview = document.getElementById("previewImg") as any; 

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          this.testFiles.push(file);
          
          const reader  = new FileReader();

          comp.setStepHidden(3);

          let fileName = file.name;
          let fileType = file.type;


          this.zone.runOutsideAngular(() => {
            reader.onloadend = function () {
              comp.setCaptureMode(1,1);
  
              comp.addPreviewItem(reader.result, reader.result, fileType, fileName);
  
              if (comp.selectedPreviewItem){
                comp.selectedPreviewItem = comp.previewItems[0];
              }
  
              //preview.src = reader.result;
  
              console.log("dne");
              console.log(comp);
  
             // comp.ref.detectChanges();
  
              console.log("detect changes...")
              
            
            }
          });


         
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

  getSelectedPreviewItem(field = ""){

    try{
      let item = this.previewItems[this.selectedPreviewItemIndex]; 
      
      if (field == ""){
        return item;
      }else{
        return item[field]
      }


    }catch(err){
      console.log(err);
      return;
    }

  }

  selectPreviewItemIndex(item, index){

    this.selectedPreviewItemIndex = index;

    if (item.type == 1){ // image 

      this.setStepHidden(3);
    }else if (item.type == 2){ // video  

      this.setStepHidden(4);
    }

    this.ref.detectChanges();
  }


  takePicture(){


    let canvas : any = document.getElementById("canvas");
    let videoInput : any = document.getElementById("captureVideoHidden");

    let width = videoInput.videoWidth
    let height =  videoInput.videoHeight;

    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(videoInput, 0, 0, width, height);
  
    var data = canvas.toDataURL('image/png')

    return data;

  }

  capturePicture(){

    let pictureData = this.takePicture();

    let fileName = Date.now() + "_image.png";

    this.addPreviewItem(pictureData, pictureData, 'image/png', fileName);

    

  }

  takeVideo(){

    this.startRecord();
    const comp = this;

    setTimeout(function(){

        comp.tmpPictureTaken = comp.takePicture();

        comp.stopRecord();
    }, 1000);

    console.log("takeVid");
  }

  getPreviewSrc(reqType, selItem){

    try{
      let item = this.selectedPreviewItem; 

      let itemType = item.type.substring(0, item.type.indexOf('/'));

      if (itemType == reqType){
        return item.srcThumbnail;
      }else{
        return "";
      }

    }catch(err){
      return ""; 
    }


  }

  slidePlay(event){
    //console.log(event);

    this.currentPrc = event.value;

    this.slideFrame();
  }

  slideFrame(){
    let video : any = document.getElementById("previewVideo");

    var newTime  = this.currentPrc / video.duration ;

    video.currentTime  = newTime;

    //window.requestAnimationFrame(this.slideFrame.bind(this));
  }

  urltoFile(url, filename, mimeType){
      return (fetch(url)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], filename, {type:mimeType});})
      );
  }


  addToCollection(){

    let self = this;

    if (this.selectedCollection){

      let selectedItem = this.getSelectedPreviewItem();

      selectedItem["isAdded"] = true;

      let newFile = this.urltoFile(selectedItem.src, selectedItem.originalName, selectedItem.type).then(function(file){
          console.log(file);

          // You could upload it like this:
          var formData = new FormData()
          formData.append('file', file);
          formData.append('newTags', JSON.stringify(selectedItem.newTags));


        console.log(file);

        self.api.addImageSession(self.selectedCollection.collectionId, formData).subscribe(
          (data) => {
            
            try{
              console.log(data);
              
              const toast = self._service.success('Item added!', '#'+self.selectedCollection.collectionTitle, {
                timeOut: 2000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true,
                clickIconToClose: true
              });
  
            }
            catch(err){
              console.log(err);
              return null;
            } 
    
          },
          error => {
            self.api.handleAPIError(error);
          }
        )

      })

  

  
    }else{
      const toast = this._service.info('Info', 'Select a collection first', {
        timeOut: 2000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        clickIconToClose: true
      });
    }
    
  }

  deletePreviewIcon(event, i){
    event.stopPropagation();
    this.previewItems.splice(i, 1);
    this.ref.detectChanges();

    if (this.previewItems.length == 0){
      this.setStepHidden(1);
    }
  }

  toggleMenu(){

    let menu = document.getElementById("side-panel-menu");
    menu.classList.toggle("open");

  }


  openCommentAdd(dropCoords) {

    let comp = this; 

    let dialog = this.dialog.open(CommentDialogComponent, {
        data: { coords: dropCoords }
    });
  
    dialog.afterClosed()
      .subscribe(newTag => {
        if (newTag) {

          let activeItem = comp.previewItems[comp.selectedPreviewItemIndex];
          
          activeItem.newTags.push(newTag);

          console.log(newTag);
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
    }

  deleteNewTag(index){
      let item = this.getSelectedPreviewItem();

      item.newTags.splice(index, 1);
  }

  editCommentAdd(newTag, index) {

    let comp = this; 

    let dialog = this.dialog.open(CommentDialogComponent, {
        data: { newTag: newTag }
    });
  
    dialog.afterClosed()
      .subscribe(newTagModified => {
        if (newTagModified) {

          let activeItem = comp.previewItems[comp.selectedPreviewItemIndex];

          activeItem.newTags[index] = newTagModified; 
          
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
    }

    
    resetCommentDrag(elmt){
      elmt.removeAttribute("style");
    }
    
    
    dragElement(elmnt, dragType) {
  
      let comp = this; 
  
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
      } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
      }
    
      function dragMouseDown(e) {
        elmnt.classList.add("isDragged");
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }
    
      function elementDrag(e) {
        
        e = e || window.event;
        if(e.preventDefault) e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


        let elementsMouseIsOver : any = document.elementsFromPoint(e.clientX, e.clientY);

        checkIfImgIsInFocus(elementsMouseIsOver);

      }

      function checkIfImgIsInFocus(elementList){

        let imgIsInFocus = false;

        Array.prototype.forEach.call(elementList, function (element){
          if (element.id == "previewImg"){
            imgIsInFocus = true;
          }
        });

        let previewImg = document.getElementById("previewImg"); 


        if (imgIsInFocus){
          previewImg.classList.add("isInFocus");
        }else{
          previewImg.classList.remove("isInFocus")
        }

        return imgIsInFocus


      }
    
      function closeDragElement(e) {
  
        elmnt.classList.remove("isDragged");

        let elementsMouseIsOver : any = document.elementsFromPoint(e.clientX, e.clientY);

        let imgIsInFocus = checkIfImgIsInFocus(elementsMouseIsOver);
        comp.resetCommentDrag(elmnt);
        
        if (imgIsInFocus){

          let previewImg = document.getElementById("previewImg"); 
          previewImg.classList.remove("isInFocus")

          let elementMouseIsOver = document.elementFromPoint(e.clientX, e.clientY);

          let previewContainer = document.getElementById("previewImg-container");
          let containerOffset = previewContainer.getBoundingClientRect();

          const offsetLeftContainer = containerOffset.left;
          const offsetTopContainer = containerOffset.top;

          let imgInfo = comp.getImgSizeInfo(elementMouseIsOver);

          let resultingCoords = {
            "x" : e.clientX - (offsetLeftContainer + imgInfo.left ),
            "y" : e.clientY - (offsetTopContainer), 

            "xRatio" : (e.clientX - (offsetLeftContainer + imgInfo.left )) / imgInfo.width,
            "yRatio" : (e.clientY - (offsetTopContainer)) / imgInfo.height,

            "prevContainerXRatio" : (e.clientX - offsetLeftContainer) / containerOffset.width,
            "prevContainerYRatio" : (e.clientY - offsetTopContainer) / containerOffset.height,
          }

          console.log("resultingCoords within picture")
  
          console.log(resultingCoords)

          comp.openCommentAdd(resultingCoords);

          console.log(e);

        }
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
    

    imgMouseUp(evt){
      console.log("img mouse up")
      console.log(evt);
    }
    
    isDropped(evt){
      console.log("img dropped")
      console.log(evt);
    }



    getRenderedSize(contains, cWidth, cHeight, width, height, pos){
      var oRatio = width / height,
          cRatio = cWidth / cHeight;
      return function() {
        if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
          this.width = cWidth;
          this.height = cWidth / oRatio;
        } else {
          this.width = cHeight * oRatio;
          this.height = cHeight;
        }      
        this.left = (cWidth - this.width)*(pos/100);
        this.right = this.width + this.left;
        return this;
      }.call({});
    }
    
    getImgSizeInfo(img) {
      var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');

      let imgInfo = this.getRenderedSize(true,
        img.width,
        img.height,
        img.naturalWidth,
        img.naturalHeight,
        parseInt(pos[0]));

      return imgInfo ;
    }


    tagHoverIn(tag){
      tag["inFocus"] = true;
    }

    tagHoverOut(tag){
      delete tag["inFocus"];
    }

}

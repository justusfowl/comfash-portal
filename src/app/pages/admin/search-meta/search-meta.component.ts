import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import {DomSanitizer} from '@angular/platform-browser'
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { v1 as uuid } from 'uuid';
import { NotificationService } from '../../../services/notification.service';

export class User {
    constructor(public name: string) { }
  }

@Component({
  selector: 'app-search-meta',
  templateUrl: './search-meta.component.html',
  styleUrls: ['./search-meta.component.scss']
})
export class SearchMetaComponent implements OnInit, AfterViewInit {

    public myForm: FormGroup;

    searchItems : any[] = [];

    metaDataObj : any;

    attrTypeOptions : any = [];

    activeIndex : number;

    quickBox : boolean = false;
    replaceInitialLabel : boolean = true;

    mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    element = null;

    selectedLabel : any = null;

    itemDateLoaded : any;

    sessionCount : number = 0;

    totalTimesWorkedOn =  [];



    @HostListener('document:keydown', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
        
        // console.log(evt)

        if (evt.key == "Escape"){
            this.detectEscape();
        }

        if (evt.key == "s" && evt.altKey){
            if (this.myForm.value.id != ""){
                this.approveImage(this.myForm);
            }
            
        }

        if (evt.key == "-" && evt.altKey){
            if (this.myForm.value.id != ""){
                this.disregardImage(this.myForm);
            }
        }

    }

    isSetTrainOnly : boolean = false;

    availableGroupLabels = [];

    isValidatedGroupLabelInfo : any = {
        "total" : "-"
    };

    groupLabelInfoSelected : any; 

    groupLabelsInfoChangedItem : any;

    constructor(
        private api : ApiService,
        public util : UtilService,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer, 
        private notify : NotificationService
    ) { 
        
    }

    ngOnInit() {
        this.myForm = this._fb.group({
            id: "",
            sessionId: "",
            path: "",
            owner: "",
            origPath: "",
            origEntity: "",
            sessionThumbnailPath: "",
            content_type: "",
            sourcePage: "",
            _childDocuments_: this._fb.array([
                this.initLabel()
            ])
        });

        this.getGroupLabelsInfo();

    }

    ngAfterViewInit(){
        
        this.getMetaItems();
    }

    setTrainOnly(isSetTrainOnly){
        this.isSetTrainOnly = isSetTrainOnly;
    }

    parseItem(item, index){
        this.activeIndex = index;

        if (item){

            if (typeof(item.isSetTrainOnly) != "undefined"){
                this.setTrainOnly(item.isSetTrainOnly)
            }else{
                this.setTrainOnly(false)
            }

           let childDocsArr = [];

            for (var i=0;i<item._childDocuments_.length;i++){

                var child = item._childDocuments_[i];

                childDocsArr.push(this._fb.group({
                    path: child.path,
                    id: child.id,
                    prob: child.prob,
                    sex : child.sex,
                    attr_color: child.attr_color,
                    attr_fabric: child.attr_fabric,
                    attr_texture: child.attr_texture,
                    attr_category: child.attr_category,
                    attr_origin: child.attr_origin,
                    attr_type: child.attr_type,
                    bbox: child.bbox,
                }));

            }

            let formObj = {
                id: item.id,
                path: item.path,
                sessionId: item.sessionId,
                owner: item.owner,
                origPath: item.origPath,
                origEntity: item.origEntity,
                sessionThumbnailPath: item.sessionThumbnailPath,
                content_type: item.content_type,
                sourcePage: item.sourcePage,
                _childDocuments_: this._fb.array(childDocsArr)
            }

            this.myForm = this._fb.group(formObj); 
        }

    }

    detectEscape(){

        this.element = null;
        let canvas = document.getElementsByClassName("large-image")[0] as any;
        canvas.style.cursor = "default";
        
        let tmpBox = document.getElementById("tmp_rect");
        if (tmpBox){
            tmpBox.remove();
        }

    }

    setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
            this.mouse.x = ev.pageX + window.pageXOffset;
            this.mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
            this.mouse.x = ev.clientX + document.body.scrollLeft;
            this.mouse.y = ev.clientY + document.body.scrollTop;
        }
    };

    getBboxStyle(label){

        let bbox = label.value.bbox; 

        let style = "";

        let image = document.getElementsByClassName("large-image")[0];

        let clientRects = image.getClientRects()[0] as any;



        let relWidth = (bbox.relWidth) ? bbox.relWidth : 0; 
        let relHeight = (bbox.relHeight) ? bbox.relHeight : 0; 

        let relX = ((bbox.relX) ? bbox.relX : 0); 
        let relY = ((bbox.relY) ? bbox.relY : 0); 

        style += "top: " + (relY*clientRects.height + clientRects.y) + "px;";
        style += "left: " + (relX*clientRects.width + clientRects.x) + "px;";
        style += "width: " + (relWidth*clientRects.width) + "px;";
        style += "height: " + (relHeight*clientRects.height) + "px;";
        style += "position:absolute;";
        style += "pointer-events:none !important;";   

        return this.sanitizer.bypassSecurityTrustStyle(style);

    }

    imageClick(evt){

        let canvas = evt.target;
        let parent = canvas.parentNode;

        if (this.element !== null) {

            // end of clicking the bounding box
            // create the coords of left-top corner for x/y (+ in relative terms to image size)

            let clientRects = canvas.getClientRects()[0];

            let width = Math.abs(this.mouse.x - this.mouse.startX);
            let height = Math.abs(this.mouse.y - this.mouse.startY);

            let relWidth = width / clientRects.width; 
            let relHeight = height / clientRects.height; 

            let xOffset = clientRects.x;
            let initX = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x : this.mouse.startX;

            let yOffset = clientRects.y;
            let initY = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y : this.mouse.startY;

            let x = initX - xOffset;
            let y = initY - yOffset;

            let relX = x/clientRects.width;
            let relY = y/clientRects.height;

            let bbox = {
                relWidth : relWidth,
                relHeight : relHeight,
                width: width, 
                height: height,
                relX: relX,
                relY: relY,
                x : x,
                y : y
            }

            this.element = null;
            canvas.style.cursor = "default";

            this.addLabel(bbox,evt.ctrlKey);
            document.getElementById("tmp_rect").remove();
        } else {
            this.mouse.startX = this.mouse.x;
            this.mouse.startY = this.mouse.y;
            this.element = document.createElement('div');
            this.element.id = 'tmp_rect';
            this.element.className = 'rectangle';
            this.element.style.position = "absolute";
            this.element.style.border = "1px solid red";
            this.element.style.left = this.mouse.x + 'px';
            this.element.style.top = this.mouse.y + 'px';
            parent.appendChild(this.element)
            canvas.style.cursor = "crosshair";
        }
        
        

    }

    imageMouseMove(evt){
        this.setMousePosition(evt);
        if (this.element !== null) {
            this.element.style.width = Math.abs(this.mouse.x - this.mouse.startX) + 'px';
            this.element.style.height = Math.abs(this.mouse.y - this.mouse.startY) + 'px';
            this.element.style.left = (this.mouse.x - this.mouse.startX < 0) ? this.mouse.x + 'px' : this.mouse.startX + 'px';
            this.element.style.top = (this.mouse.y - this.mouse.startY < 0) ? this.mouse.y + 'px' : this.mouse.startY + 'px';
        }
    }

    initLabel(path?, id?, bbox?) {
        // initialize our address

        if (this.quickBox && this.myForm.value._childDocuments_.length > 0){

            let template = this.myForm.value._childDocuments_[this.myForm.value._childDocuments_.length-1];

            return this._fb.group({
                path: path || '',
                id: id || '',
                prob: '',
                sex : template.sex || '' ,
                attr_color: template.attr_color || '',
                attr_category: template.attr_category || '',
                attr_fabric: template.attr_fabric || '',
                attr_texture: template.attr_texture || '',
                attr_type: template.attr_type || '',
                bbox: bbox || ''
            });
        }else{
            return this._fb.group({
                path: path || '',
                id: id || '',
                prob: '',
                sex : '',
                attr_color: '',
                attr_category: '',
                attr_fabric: '',
                attr_texture: '',
                attr_type: '',
                bbox: bbox || ''
            });
        }
        
    }

    addLabel(bbox?, overwriteLastLabel?) {
        // add address to the list

        let id = uuid().replace(/-/g, "");
        let path = <FormArray>this.myForm.controls['path'].value + ".label";

        const control = <FormArray>this.myForm.controls['_childDocuments_'];
        control.push(this.initLabel(path, id, bbox));

        if (this.replaceInitialLabel || overwriteLastLabel){
            control.removeAt(control.length - 2);
            if (!overwriteLastLabel){
                this.replaceInitialLabel = false;
            }
        }
    }

    removeAddress(i: number) {

        console.log("removeAddressClicked")
        // remove address from the list
        const control = <FormArray>this.myForm.controls['_childDocuments_'];
        control.removeAt(i);
    }


    groupLabelsInfoChanged(evt){

        console.log(evt);
        let options;

        if (evt.value != "all"){

            this.groupLabelsInfoChangedItem = evt.value;

            this.getIsValidatedGroupLabelInfo();
        }else{

            this.groupLabelInfoSelected = null;

            this.isValidatedGroupLabelInfo = {
                "total" : "-", 
                "label" : "all"
            }

        }
       
        this.getSearchItems();
        
    }



    getGroupLabelsInfo(){

        this.api.getGroupLabelsInfo().subscribe(
            (data : any) => {
                
                try{

                   this.availableGroupLabels = data;

                   

                }
                catch(err){
                    console.log(err);
                } 

            },
            error => {
                this.api.handleAPIError(error);
            }
            )
    }

    getIsValidatedGroupLabelInfo(){

        let options = {
            "isValidated" : true,
            "attr_category" : this.groupLabelsInfoChangedItem
        }

        this.api.getGroupLabelsInfo(options).subscribe(
            (data : any) => {
                
                try{

                   this.isValidatedGroupLabelInfo = data[0];

                }
                catch(err){
                    console.log(err);
                } 

            },
            error => {
                this.api.handleAPIError(error);
            }
            )

        
    }



    getSearchItems(){

        let options;

        if (this.groupLabelsInfoChangedItem != "all"){
            options = {
                "attr_category" : this.groupLabelsInfoChangedItem
            }
        }else{
            options = {};
        }



        this.api.getSearchItemMeta(options).subscribe(
            (data : any) => {
                
                try{

                    this.parseItem(data[0], 0);

                    this.searchItems = data;

                    this.itemDateLoaded = new Date();

                    this.replaceInitialLabel = true;

                }
                catch(err){
                    console.log(err);
                } 

            },
            error => {
                this.api.handleAPIError(error);
            }
            )
    }

    getMetaDataTypeOptions(metaData){

        this.attrTypeOptions.length = 0; 

        for (var i=0; i<metaData.length;i++){
            let obj = {
                "name" : metaData[i].attr_type
            }

            // texture and fabric are attributes by themselves (like color)
            if (obj.name != "texture" && obj.name != "fabric"){
                this.attrTypeOptions.push(obj)
            }
            
        }
        
    }

    getMetaItems(replace=true){

        this.api.getSearchMetaData().subscribe(
            (data : any) => {
                
                try{
                    if (replace){
                        this.metaDataObj = data;
                    }else{
                        for (var i=0; i<data.length; i++){

                            this.metaDataObj.push(data[i])
                        }
                    }

                    this.getMetaDataTypeOptions(data.meta);

                    this.getSearchItems();
                   
                    
                }
                catch(err){
                    console.log(err);
                } 

            },
            error => {
                this.api.handleAPIError(error);
            }
            )
    }

    save(model: any) {
        // call API to save customer
        console.log(model);
    }

    removeActiveItem(){
        this.searchItems.splice(this.activeIndex, 1);
        let self = this; 

        setTimeout(function(){
            if (self.searchItems.length == 0){
                self.getMetaItems();
            }
        }, 1000)
        
    }


    approveImage(myForm){

        let searchItem = myForm.value; 

        for (var i=0; i<searchItem._childDocuments_.length;i++){
            let label = searchItem._childDocuments_[i];
            Object.keys(searchItem._childDocuments_[i]).forEach(function(key,index) {
                if(!searchItem._childDocuments_[i][key] && searchItem._childDocuments_[i][key] == ""){
                    delete searchItem._childDocuments_[i][key];
                }
            });
        }

        searchItem["isSetTrainOnly"] = this.isSetTrainOnly;
        
        let body = {"searchItem" : searchItem };

        this.api.approveSearchItemMeta(body).subscribe(
            (data : any) => {
                
                console.log("approved!");
                this.removeActiveItem();
                let durationMsg = " ("
                durationMsg += this.util.formatDateDiffToNow(this.itemDateLoaded);
                durationMsg += ")";

                durationMsg = durationMsg.replace("ago","");

                this.notify.toastInfo("METASEARCH_APPROVE", durationMsg);

                this.sessionCount++;

                let timeDiffSeconds = (new Date().getTime() - this.itemDateLoaded) / 1000;

                this.totalTimesWorkedOn.push(timeDiffSeconds)

                this.getIsValidatedGroupLabelInfo();
            },
            error => {
                this.api.handleAPIError(error);
            }
            )

    }

    getAverageTime(timesArray){
        var sum, avg = 0;
        // dividing by 0 will return Infinity
        // arr must contain at least 1 element to use reduce
        if (timesArray.length){
            sum = timesArray.reduce(function(a, b) { return a + b; });
            avg = sum / timesArray.length;
        }
        return avg;
    }

    focusLabel(item){
        this.selectedLabel = item;
    }

    focusOutLabel(){
        this.selectedLabel = null;
    }

    disregardImage(myForm){
        console.log(myForm);

        let id =  myForm.value.id;
        
        this.api.rejectSearchItemMeta(id).subscribe(
            (data : any) => {
                console.log("rejected!");
                this.removeActiveItem();
                this.notify.toastInfo("METASEARCH_REJECT");
                this.sessionCount++;
            },
            error => {
                this.api.handleAPIError(error);
            }
            )

    }

}

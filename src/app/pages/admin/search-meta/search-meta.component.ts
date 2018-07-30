import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { UtilService } from '../../../services/util.service';
import {DomSanitizer} from '@angular/platform-browser'

import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import { v1 as uuid } from 'uuid';

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

    mouse = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0
    };
    element = null;

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(evt: KeyboardEvent) {
        this.detectEscape();
    }

    isSetTrainOnly : boolean = false;



    constructor(
        private api : ApiService,
        public util : UtilService,
        private _fb: FormBuilder,
        private sanitizer: DomSanitizer
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
        console.log("aborted.");

        document.getElementById("tmp_rect").remove();

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

        let width = (bbox.width) ? bbox.width : 0; 
        let height = (bbox.height) ? bbox.height : 0; 

        let left = ((bbox.x) ? bbox.x : 0) + clientRects.x; 
        let top = ((bbox.y) ? bbox.y : 0)  + clientRects.y; 

        style += "top: " + top + "px;";
        style += "left: " + left + "px;";
        style += "width: " + width + "px;";
        style += "height: " + height + "px;";
        style += "position:absolute;";
        style += "pointer-events:none !important;";   

        return this.sanitizer.bypassSecurityTrustStyle(style);

    }

    imageClick(evt){

        let canvas = evt.target;
        let parent = canvas.parentNode;

        if (this.element !== null) {

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
            this.addLabel(bbox);
            console.log("finsihed.");
            document.getElementById("tmp_rect").remove();
        } else {
            console.log("begun.");
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

    addLabel(bbox?) {
        // add address to the list

        let id = uuid().replace(/-/g, "");
        let path = <FormArray>this.myForm.controls['path'].value + ".label";

        const control = <FormArray>this.myForm.controls['_childDocuments_'];
        control.push(this.initLabel(path, id, bbox));
    }

    removeAddress(i: number) {

        console.log("removeAddressClicked")
        // remove address from the list
        const control = <FormArray>this.myForm.controls['_childDocuments_'];
        control.removeAt(i);
    }



    getSearchItems(){

        this.api.getSearchItemMeta().subscribe(
            (data : any) => {
                
                try{

                    this.parseItem(data[0], 0);

                    this.searchItems = data;

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

        console.log(body);


        /*
        this.api.approveSearchItemMeta(body).subscribe(
            (data : any) => {
                
                console.log("approved!");
                this.removeActiveItem();
            },
            error => {
                this.api.handleAPIError(error);
            }
            )
            */
    }

    focusItem(item){
        console.log(item)
    }

    disregardImage(myForm){
        console.log(myForm);

        let id =  myForm.value.id;
        
        this.api.rejectSearchItemMeta(id).subscribe(
            (data : any) => {
                console.log("rejected!");
                this.removeActiveItem()
            },
            error => {
                this.api.handleAPIError(error);
            }
            )

    }

}

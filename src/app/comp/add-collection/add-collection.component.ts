
import { Component, Inject , OnInit} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../../services/api.service';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { InputDebounceDirective } from "../../directives/input-debounce/input-debounce.directive";
import { Collection } from '../../models/datamodel';


@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.scss', '../../app.component.scss']
})
export class AddCollectionComponent implements OnInit {

  sharedWithUsers: any[] = [];

  tmpSearchlist : any;
  searchTerm : string;

  privSelected : string = "0";

  newCollection : boolean = true;
  reallyDelete : boolean = false;

  privacyOptions = [
    {
      "option": "Unset",
      "value" : "0"
    },
    {
      "option": "Me",
      "value" : "1"
    },
    {
      "option": "Restricted",
      "value" : "2"
    },
    {
      "option": "Public",
      "value" : "3"
    },

  ]

  collectionTemplate = {
    'collectionId' : 0,
    'collectionTitle': "",
    'collectionDescription' : "",
    'privacyStatus': "2",
    'sharedWithUsers' : []
  };

  collectionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddCollectionComponent>, 
    @Inject(MAT_DIALOG_DATA) public data:any, 
    public fb: FormBuilder, 
    public api: ApiService, 
    private spinnerService: Ng4LoadingSpinnerService) {

     }

  ngOnInit() {

    let newTemplate = this.collectionTemplate; 

    this.collectionForm = this.fb.group(newTemplate);

    if (this.data.collectionId){

      this.newCollection = false;

      this.api.getCollectionDetails(this.data.collectionId).subscribe(
        (data) => {
          
          try{
  
            let tmpCollection = new Collection(data);
            this.privSelected = tmpCollection.privacyStatus;

            let newFormGroup = this.fb.group(tmpCollection);


            this.collectionForm = newFormGroup
            console.log(newFormGroup)
            this.sharedWithUsers = data.sharedWithUsers;

            console.log("data here")
  
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

  }

  public searchChanged(value) {


    this.api.getUsers(value).subscribe(
      (data) => {
        
        try{

          this.tmpSearchlist = data;
          
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

  removeFriend(friend, index){
    this.sharedWithUsers.splice(index, 1);
  }

  addFriend(friend): void {
    this.sharedWithUsers.push(friend);
  }

  getIfCheckedHidden(friend){
    if(this.getIfActive(friend).active) {
      return false
    }else{
      return true;
    }
   
  }

  getIfActive(friend){

    let isActive = false;
    let j = -1;

    for (var i=0; i<this.sharedWithUsers.length; i++){
      if (this.sharedWithUsers[i].userName == friend.userName){
        isActive = true;
        j = i;
      }
    }

    return {
      active: isActive, 
      index: j};
  }

  toggleFriend(friend){
    let isActive = this.getIfActive(friend);

    if (isActive.active){
      this.removeFriend(friend, isActive.index)
    }else{
      this.addFriend(friend);
    }

  }

  saveCollection() {

    let collection = new Collection(this.collectionForm.value);

    collection.sharedWithUsers = this.sharedWithUsers; 

    if (this.newCollection){
      this.createCollection(collection);
    }else{
      this.updateCollection(collection)
    }

   
  }

  createCollection(collection){
    this.api.addCollection(collection).subscribe(
      (data) => {
        
        try{

          console.log("in save collection")
          this.dialogRef.close(collection);
          
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

  updateCollection(collection){
    this.api.updateCollectionDetails(collection).subscribe(
      (data) => {
        
        try{

          console.log("in save collection")
          this.dialogRef.close(collection);
          
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

  cancel(){
    this.dialogRef.close();
  }

  askDelete(){

    if (this.reallyDelete){
      this.reallyDelete = false;
    }else{
      this.reallyDelete = true;
    }
  }


  delete(){
    let collection = new Collection(this.collectionForm.value);
    
    this.api.deleteCollection(collection.getId()).subscribe(
      (data) => {
        
        try{

          console.log("deleted")
          this.dialogRef.close({"reponse" : true});
          
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

}

import { Component, Inject , OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup} from '@angular/forms';

import { ApiService } from '../../services/api.service';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss', '../../app.component.scss']
})
export class CommentDialogComponent implements OnInit {

  tagTemplate = {
    'tagUrl': "",
    'tagCategory': "",
    'tagAmount': "",
    'tagSeller' : "",
    'tagTitle' : "",
    'tagImage' : "",
    'coords' : this.data.coords
  };


  newTag: FormGroup;

  previewTagItem : any;

  lookupFinished : boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data:any, 
    public fb: FormBuilder, 
    public api: ApiService, 
    private spinnerService: Ng4LoadingSpinnerService) {

      this.previewTagItem = this.tagTemplate;

     }

  ngOnInit() {



    if (this.data.newTag){

      this.previewTagItem = this.data.newTag;

      this.newTag = this.fb.group(this.data.newTag);
      

      this.lookupFinished = true;

    }else if (this.data.coords){
      let newTemplate = this.tagTemplate; 

      this.newTag = this.fb.group(newTemplate);
      this.previewTagItem = newTemplate; 


    }else{
      console.log("no coords for new tag provided");
    }

    this.onChanges();


  }

  onChanges(): void {
    this.newTag.valueChanges.subscribe(val => {
      this.previewTagItem = val;
    });
  }


  pasteUrl (){

    this.lookupFinished = false;
    this.spinnerService.show();

    this.api.getUrlPreview(this.newTag.value.tagUrl).subscribe(
      (data : any) => {


          this.newTag.patchValue({"tagSeller" : data.url.substring(5, 15)});
          this.newTag.patchValue({"tagImage" : data.image});
          this.newTag.patchValue({"tagTitle" : data.title});

          this.spinnerService.hide();
          this.lookupFinished = true;
      },
      error => {
        console.log("error");
        console.log(error)
      }
    )
  }

  previewTag(tag){
    this.previewTagItem = tag;
  }

  addTag() {

    let newTag = this.previewTagItem; 

    this.dialogRef.close(newTag);
  }

  cancel(){
    this.dialogRef.close();
  }

}

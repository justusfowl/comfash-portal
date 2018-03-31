import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ViewComponent>) { }

  ngOnInit() {
  }


  closeView() {
    this.dialogRef.close("this.choosenEmoji");
  }

}

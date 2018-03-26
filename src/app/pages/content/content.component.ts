import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommentDialogComponent } from '../../comp/comment-dialog/comment-dialog.component'


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private dialog : MatDialog) { }

  ngOnInit() {

    this.dragElement(document.getElementById(("addComment")));
    this.dragElement(document.getElementById(("addTag")));

  }

  openCommentAdd() {
    let dialog = this.dialog.open(CommentDialogComponent);

    dialog.afterClosed()
      .subscribe(selection => {
        if (selection) {
          console.log(selection);
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  resetCommentDrag(elmt){
    elmt.removeAttribute("style");
  }


  dragElement(elmnt) {

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
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement(e) {

      elmnt.classList.remove("isDragged");
      
      comp.resetCommentDrag(elmnt);

      console.log("mouse up")
      console.log(e)
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }



}

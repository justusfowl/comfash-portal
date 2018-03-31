import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommentDialogComponent } from '../../comp/comment-dialog/comment-dialog.component';

import { DomSanitizer } from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from "@angular/router";
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  purchaseTags = [
    {
      "seller" : "Zalando", 
      "url" : "https://www.zalando.de/tommy-hilfiger-layton-belt-guertel-brown-to152d06k-o12.html", 
      "picUrl" : "https://mosaic02.ztat.net/vgs/media/pdp-gallery/TO/15/2D/06/KO/12/TO152D06K-O12@6.jpg", 
      "category" : "Belt", 
      "location" : "top: 28%; left: 25%;", 
      "isActive" : false
    },
    {
      "seller" : "Zalando", 
      "url" : "https://www.zalando.de/tommy-hilfiger-layton-belt-guertel-brown-to152d06k-o12.html", 
      "picUrl" : "https://mosaic02.ztat.net/vgs/media/pdp-gallery/TO/15/2D/06/KO/12/TO152D06K-O12@7.jpg", 
      "category" : "Jacket", 
      "location" : "top: 12%; left: 81%;", 
      "isActive" : false
    },
    {
      "seller" : "Zalando", 
      "url" : "https://www.zalando.de/tommy-hilfiger-layton-belt-guertel-brown-to152d06k-o12.html", 
      "picUrl" : "https://mosaic02.ztat.net/vgs/media/pdp-gallery/TO/15/2D/06/KO/12/TO152D06K-O12@8.jpg", 
      "category" : "Blouse", 
      "location" : "top: 55%; left: 33%;", 
      "isActive" : false
    },
    {
      "seller" : "Zalando", 
      "url" : "https://www.zalando.de/tommy-hilfiger-layton-belt-guertel-brown-to152d06k-o12.html", 
      "picUrl" : "https://mosaic02.ztat.net/vgs/media/pdp-gallery/TO/15/2D/06/KO/12/TO152D06K-O12@5.jpg", 
      "category" : "Belt", 
      "location" : "top: 24%; left: 91%;", 
      "isActive" : false
    }
  ]

  public similarOutfits = [
    {
      "imgPath" : "../../assets/img/6.jpg", 
      "dateDay" : "07", 
      "dateMonth" : "mar", 
      "dateYear" : "18",
      "likes" : 9, 
      "comments" : 4, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "imgPath" : "../../assets/img/8.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "dateYear" : "18",
      "likes" : 29, 
      "comments" : 2, 
      "voteStats" : {
        "avg" : 61
      }
    },
    {
      "imgPath" : "../../assets/img/9.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "dateYear" : "17",
      "likes" : 19, 
      "comments" : 112, 
      "voteStats" : {
        "avg" : 89
      }
    },
    {
      "imgPath" : "../../assets/img/10.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "dateYear" : "17",
      "likes" : 15, 
      "comments" : 5, 
      "voteStats" : {
        "avg" : 51
      }
    },
    {
      "imgPath" : "../../assets/img/3.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 29, 
      "comments" : 1, 
      "voteStats" : {
        "avg" : 81
      }
    }
  ]

  public commentList = [
    {
      "commentOwner" : "@Timchen", 
      "commentText" : "This is a nice one",
      "commentDate" : new Date(), 
      "ownerAvatarPath" :  "../../assets/img/3.jpg", 
    },
    {
      "commentOwner" : "@Lärchen", 
      "commentText" : "I like how this shirt works together with your pair of shoes.",
      "commentDate" : new Date(), 
      "ownerAvatarPath" :  "../../assets/img/4.jpg", 
    },
    {
      "commentOwner" : "@Timchen", 
      "commentText" : "Maybe you could also try another tone of blue?",
      "commentDate" : new Date(), 
      "ownerAvatarPath" :  "../../assets/img/6.jpg", 
    },
    {
      "commentOwner" : "@Harald", 
      "commentText" : "I have that pair of pants and it goes really well with a black belt also.",
      "commentDate" : new Date(), 
      "ownerAvatarPath" :  "../../assets/img/7.jpg", 
    }

  ];

  public sessionCompare = [
    {
      "sessionItemPath" : '../../assets/img/6.jpg',
      "voteStats" : {
        "voteCnt" : 1, 
        "commentCnt" : 5
      }
    }, 
    {
      "sessionItemPath" : '../../assets/img/7.jpg',
      "voteStats" : {
        "voteCnt" : 1, 
        "commentCnt" : 5
      }
    }
  ]

  addToCollection = new FormControl();

  public collectionList = ['Wedding-Dress', 'CasualMine'];

  public panelStep : number = 1;
  sessionItemSelected : number = 1; 

  constructor(
    private dialog : MatDialog, 
    private san : DomSanitizer,
    private location: Location, 
    private router: Router, 
    public util : UtilService ) { }

  ngOnInit() {

    // this.dragElement(document.getElementById(("addComment")));
    // this.dragElement(document.getElementById(("addTag")));

  }

  setPanelStep(step : number){
    this.panelStep = step;
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

  hoverInTag(tag){
    tag.isActive = true;
  }

  hoverOutTag(tag){
    tag.isActive = false;
  }

  close(){

    const loc = this.location;

    let currentPath = loc.path(); 
    let referrerPath = document.referrer;

    if (this.util.extractHostname(currentPath) == this.util.extractHostname(referrerPath) && referrerPath && referrerPath.length > 0 ){
      loc.back();
    }
    else{
      this.router.navigate(['imgCollection']);  
    }
  }

}

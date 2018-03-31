import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-img-collection',
  templateUrl: './img-collection.component.html',
  styleUrls: ['./img-collection.component.scss',
              '../../app.component.scss']
})
export class ImgCollectionComponent implements OnInit {


  public sessions = [
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

  constructor(private router: Router, private dialog : MatDialog) { }

  ngOnInit() {
  }

  goToContent(collection) {
    this.router.navigate(['content']); 
  }


}

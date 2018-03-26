import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

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
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "imgPath" : "../../assets/img/8.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "imgPath" : "../../assets/img/9.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "imgPath" : "../../assets/img/10.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    },
    {
      "imgPath" : "../../assets/img/3.jpg", 
      "dateDay" : "12", 
      "dateMonth" : "feb", 
      "likes" : 9, 
      "comments" : 12, 
      "voteStats" : {
        "avg" : 76
      }
    }
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToContent(collection) {
    this.router.navigate(['content']); 
  }

}

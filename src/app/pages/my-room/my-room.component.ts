import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-room',
  templateUrl: './my-room.component.html',
  styleUrls: ['./my-room.component.scss']
})
export class MyRoomComponent implements OnInit {


  public myCollections = [
    {
      "imgPath" : "../../assets/img/1.jpg",
	  "primColor" : "#33434b",
      "collectionTitle" : "#Wedding-dresses", 
	  "collectionDescription" : "Comparing dresses for the life's most important day :)", 
	  "createdDay" : "01",
	  "createdMonth" : "mar", 
	  "createdYear" : "17",
	  "voteStats" : {
		"voteCnt" : 23, 
		"commentCnt" : 55
	  }
    },{
      "imgPath" : "../../assets/img/2.jpg",
	  "primColor" : "#54592d",
      "collectionTitle" : "#Casual-Mine", 
	  "collectionDescription" : "Collecting some outfits for every day use but with neat details to them.", 
	  "createdDay" : "01",
	  "createdMonth" : "mar", 
	  "createdYear" : "17",
	  "voteStats" : {
		"voteCnt" : 23, 
		"commentCnt" : 55
	  }
    },{
      "imgPath" : "../../assets/img/3.jpg",
	  "primColor" : "#86908b",
      "collectionTitle" : "#Office-Vibes", 
	  "collectionDescription" : "Gathering ideas for the perfect office dressup, ranging from top to bottom, glasses to shoes.", 
	  "createdDay" : "01",
	  "createdMonth" : "mar", 
	  "createdYear" : "17",
	  "voteStats" : {
		"voteCnt" : 23, 
		"commentCnt" : 55
	  }
    },{
      "imgPath" : "../../assets/img/6.jpg",
	  "primColor" : "#007680",
      "collectionTitle" : "#Promnight", 
	  "collectionDescription" : "Hunting a special outfit for a very special night :)", 
	  "createdDay" : "01",
	  "createdMonth" : "mar", 
	  "createdYear" : "17",
	  "voteStats" : {
		"voteCnt" : 23, 
		"commentCnt" : 55
	  }
    }
  ]
  

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goImgCollection(collection) {
    this.router.navigate(['imgCollection']); 
  }

  voteHandler(evt){
    console.log("event from voting")
    console.log(evt);
  }


}

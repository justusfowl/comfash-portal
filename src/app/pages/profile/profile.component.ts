import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public myCollections = [
    {
      "imgPath" : "../../assets/img/1.jpg",
	  "primColor" : "#33434b",
      "collectionTitle" : "#Wedding-dresses", 
	  "collectionDescription" : "Comparing dresses for the life's most important day :)", 
	  "createdDay" : "01",
	  "createdMonth" : "mar", 
    "createdYear" : "17",
    "sessionCnt" : 4,
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
    "sessionCnt" : 5,
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
    "sessionCnt" : 17,
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
    "sessionCnt" : 8,
	  "voteStats" : {
      "voteCnt" : 23, 
      "commentCnt" : 55
      }
    }
  ]

  activityItems : any = [
    {
      "type" : "follows",
      "followDate" : "20min ago",
      "followerUser" : "schnulli",
      "followerUserAvatarPath" : "../../assets/img/6.jpg",
      "followedUser" : "harald", 
      "followedUserAvatarPath" : "../../assets/img/6.jpg", 
      "followedProfilePicPath" : "../../assets/img/9.jpg",
    },
    {
      "type" : "comment",
      "imgPath" : "../../assets/img/6.jpg",
      "colOwner" : "harald", 
      "colOwnerAvatarPath" : "../../assets/img/6.jpg",
      "collectionTitle" : "#Wedding-dress",
      "commentText" : "This is really a nice dress, like the creme color a lot.", 
      "commentCreated" : "2min ago"
    },
    {
      "type" : "comment",
      "imgPath" : "../../assets/img/8.jpg",
      "colOwner" : "harald", 
      "colOwnerAvatarPath" : "../../assets/img/6.jpg",
      "collectionTitle" : "#Wedding-dress",
      "commentText" : "This is really a nice dress, like the creme color a lot.", 
      "commentCreated" : "2min ago"
    },
    {
      "type" : "comment",
      "imgPath" : "../../assets/img/11.jpg",
      "colOwner" : "harald", 
      "colOwnerAvatarPath" : "../../assets/img/6.jpg",
      "collectionTitle" : "#Wedding-dress",
      "commentText" : "This is really a nice dress, like the creme color a lot.", 
      "commentCreated" : "2min ago"
    }
  ]

  constructor() { }

  context: any = {
      text: 'test'
  }

  ngOnInit() {
  }

  voteHandler(evt){
    console.log("event from voting")
    console.log(evt);
  }


}

import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { MatDialog } from '@angular/material';
import { AddCollectionComponent } from '../../comp/add-collection/add-collection.component';
import { ApiService } from '../../services/api.service';
import { AuthenticationService } from '../../services/auth.service';

import { Collection, Vote } from '../../models/datamodel'
import { UtilService } from '../../services/util.service';
import { Session } from 'selenium-webdriver';


@Component({
  selector: 'app-my-room',
  templateUrl: './my-room.component.html',
  styleUrls: ['./my-room.component.scss',
	'../../app.component.scss']
})
export class MyRoomComponent implements OnInit {


  public testCollections = [
    {
    "collectionId" : 123,
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
    "collectionId" : 123,
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
    "collectionId" : 123,
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
    "collectionId" : 123,
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

  public roomCollections : any;
  public roomUserId : string;

  constructor(
		private router: Router,
    private dialog : MatDialog,
    private route: ActivatedRoute, 
    public api: ApiService, 
    public auth: AuthenticationService, 
    public util : UtilService) { }

  ngOnInit() {

    this.route.params.subscribe(params => this.loadCollection(params.userId)); // Object {}
  }

  loadCollection(userId){

  
    if (!userId){
      userId = this.auth.getUserId();
    }

    this.roomUserId = userId;

    this.api.loadRoom(userId).subscribe(
      (data) => {
        
        try{

          let outData = data.map(function(val){
            let tmpCollection = new Collection(val);
            tmpCollection.castSessions();

            return tmpCollection;
          })

        this.roomCollections = outData;

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

  goImgCollection(collectionId : number) {
    this.router.navigate(['./', collectionId], {relativeTo: this.route}); 
  }


	
	addCollection(){

		let comp = this; 

    let dialog = this.dialog.open(AddCollectionComponent, {
        data: { collection: "dropCoords" }
    });
  
    dialog.afterClosed()
      .subscribe(collection => {
        if (collection) {
          this.loadCollection(this.roomUserId)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
	}


	collectionSettings(collection : Collection){
		let comp = this; 

    let dialog = this.dialog.open(AddCollectionComponent, {
        data: { collectionId: collection.getId() }
    });
  
    dialog.afterClosed()
      .subscribe(updatedCollection => {
        if (updatedCollection) {
          this.loadCollection(this.roomUserId)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
	}


}

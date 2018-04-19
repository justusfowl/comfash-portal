import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";


import { MatDialog } from '@angular/material';
import { ApiService } from '../../services/api.service';
import { Collection, Session, Vote } from '../../models/datamodel';
import { UtilService } from '../../services/util.service';
import { AuthenticationService } from '../../services/auth.service';

import { VoteHandler } from '../../comp/vote';

@Component({
  selector: 'app-img-collection',
  templateUrl: './img-collection.component.html',
  styleUrls: ['./img-collection.component.scss',
              '../../app.component.scss']
})
export class ImgCollectionComponent implements OnInit {

  public collection: any;

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

  collectionId : number;
  public roomUserId : string;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private dialog : MatDialog, 
    public api: ApiService, 
    public util: UtilService, 
    private auth: AuthenticationService, 
    private voteHdl : VoteHandler
  ) { 
    this.route.params.subscribe(params => this.loadCollection(params)); // Object {}
  }

  ngOnInit() {

  }

  loadCollection(params: any){

    let collectionId = params.collectionId; 
    let userId = params.userId;

    this.roomUserId = userId;

    this.api.loadCollection(collectionId).subscribe(
      (data) => {
        
        try{

          let tmpCollection = new Collection(data[0]);
          tmpCollection.castSessions();

          this.collection = tmpCollection;


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

  goToContent() {

    let compareSessionsIds = this.api.compareSessionsIds; 

    this.router.navigate(['/content'], { queryParams: { session: compareSessionsIds } }); 
  }
  
  
  toggleSessionCompare(session: Session){
    this.api.toggleSessionIdCompare(session.getId())
  }

  deleteSession(session : Session){
    
    let sessionId = session.getId();

    this.api.deleteSession(session).subscribe(
      (data) => {
        
        try{
          this.collection.removeSession(sessionId);
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

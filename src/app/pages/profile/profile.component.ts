import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';
import { UtilService } from '../../services/util.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Collection } from '../../models/datamodel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileCollections : Collection[] = [];

  activityItems : any = [];
  
  /*[
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
  */

  profileUserId : string; 
  profile : any;

  constructor(
    public auth: AuthenticationService, 
    public util: UtilService, 
    private route : ActivatedRoute, 
    public api : ApiService) {

   }

  context: any = {
      text: 'test'
  }


  ngOnInit() {

    this.route.params.subscribe(params => this.loadProfile(params.userId)); // Object {}

  }

  loadProfile(userId : string){
    this.profileUserId = userId; 
    this.api.getUserProfileBase(userId).subscribe(
      (data: any) => {
        this.profile = data;
      },
      error => {
        this.api.handleAPIError(error);
      }
    )

    this.loadCollections();
    this.getActivities();

  }

  loadCollections(){

    let userId = this.profileUserId;

    if (this.profileCollections.length == 0){
       this.api.loadRoom(userId).subscribe(
      (data) => {
        
        try{

          let outData = data.map(function(val){
            let tmpCollection = new Collection(val);
            tmpCollection.castSessions();

            return tmpCollection;
          })

        this.profileCollections = outData;

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

  getActivities(){
    // as of now: do not skip any records from the activities
    // @TODO: Pagination noch offen
    this.api.getStream(99999, 0, true).subscribe(
      (data) => {
        
        try{

        this.activityItems = data;

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


  voteHandler(evt){
    console.log("event from voting")
    console.log(evt);
  }


}

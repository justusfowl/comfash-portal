

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';


import { Collection, Session, Comment, Vote, Message } from '../models/datamodel'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthenticationService } from './auth.service';
import { NotificationService } from './notification.service';
import { isComponentView } from '@angular/core/src/view/util';


@Injectable()
export class ApiService {

  tmpLinkpreviewKey = "5abb71440a8df5d2a47cdbbcc3d3af68f7d4003f796b5";

  apiURL: string;

  public compareSessionsIds = [];
  public compareSessions : any;


  public messages : Message[] = [];
  private top : number = 5; 
  private skip : number = 0;

  public cntUnread : number;


  constructor(
    public http: HttpClient,
    private cfg: ConfigService, 
    public spinner : Ng4LoadingSpinnerService, 
    public auth: AuthenticationService, 
    private notify : NotificationService
  ) {

    this.apiURL = cfg.getAPIBase();

    if (this.auth.getAuthStatus()){
      this.getSessionCompareHist();
    }
    
   }

  getUrlPreview(webUrl: string){

    let url = "https://api.linkpreview.net?key=" + this.tmpLinkpreviewKey +"&q=" + webUrl 

    return this.http.get(url);

  }

  loadRoom(userId : string){
    return this.http.get<Collection[]>(this.apiURL + '/' + "imgcollection/room/" + userId)
  }

  loadCollection(collectionId : number){
    return this.http.get<Collection>(this.apiURL + '/' + "imgcollection/" + collectionId)
  }

  getCollectionDetails(collectionId : number){
    return this.http.get<Collection>(this.apiURL + '/' + "imgcollection/" + collectionId + "/detail")
  }

  updateCollectionDetails(collection: Collection){
    return this.http.put(this.apiURL + '/' + "imgcollection/" + collection.getId(), collection)
  }

  addCollection(collection: Collection){
    return this.http.post(this.apiURL + "/imgcollection", collection);
  }

  deleteCollection(collectionId: number){
    return this.http.delete(this.apiURL + '/imgcollection' + "/" + collectionId);
  }

  getUsers(searchStr: string){
    return this.http.get(this.apiURL + '/' + "user" + "?userSearch=" + searchStr);
  }


  getUserProfileBase(userId: string){
    return this.http.get(this.apiURL + "/user/profile/" + userId);
  }

  getMoreMessages(){

    this.skip = this.skip + this.top;
    this.getMessages();

  }

  getMessages(){

    let self = this;
    let httpParams = new HttpParams().set("top" , this.top.toString()).set("skip" , this.skip.toString());

    this.getMessagesIsUnreadCnt();
 
    this.http.get(this.apiURL + '/' + "user/messages", {params: httpParams}).subscribe(
      (data: any) => {    
        
        try{

          data.forEach(element => {
            let m = new Message(element);
            self.messages.push(m);

          });

        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.handleAPIError(error);
      }
    )

  }

  updateMessageReadStatus(message: Message){

    if (message.getReadStatus()){
      this.cntUnread++;
    }else{
      this.cntUnread--;
    }

    this.http.put(this.apiURL + "/user/messages/" + message.getId(), message).subscribe(
      (data: any) => {    
        console.log("true")
      },
      error => {
        this.handleAPIError(error);
      }
    )
  }

  getMessagesIsUnreadCnt(){
    this.http.get(this.apiURL + '/' + "user/messages/cntUnread").subscribe(
      (data: any) => {    
        
        try{

          this.cntUnread = data.isUnreadCnt; 

        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.handleAPIError(error);
      }
    )
  }


  addImageSession(collectionId : number, newSession : any){

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(this.apiURL + "/imgcollection/" + collectionId + "/sessionImg", newSession, {headers: headers });
  }

  getSessions(sessions : any){

    let qryParams = {
      "session" : sessions
    };

    return this.http.get<Session[]>(this.apiURL + '/' + "imgcollection/sessions", { "params": qryParams})
  }

  deleteSession(session : Session){
    return this.http.delete(this.apiURL + "/imgcollection/" + session.getCollectionId() + "/session/" + session.getId());
  }


  addComment(comment: Comment, session : Session){
    return this.http.post(this.apiURL + "/imgcollection/" + session.getCollectionId() + "/session/" + session.getId() + "/comment", comment);
  }

  upsertVote(vote: Vote, session : Session){
    return this.http.post(this.apiURL + "/imgcollection/" + session.getCollectionId() + "/session/" + session.getId() + "/vote", vote);
  }

  deleteVote(vote: Vote, session : Session){
    return this.http.delete(this.apiURL + "/imgcollection/" + session.getCollectionId() + "/session/" + session.getId() + "/vote");
  }

  getSessionCompareHist(){
    return this.http.get(this.apiURL + '/imgcollection/compare').subscribe(
      (data: any) => {    
        
        try{
          let sessionArr = [];

          data.forEach(element => {
            let s = new Session(element);
            sessionArr.push(s);

          });
          console.log(sessionArr);

          this.compareSessions = sessionArr;

        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.handleAPIError(error);
      }
    )

  }

  toggleSessionIdCompare(sessionId: number){

    if (this.compareSessionsIds.indexOf(sessionId) > -1){
      this.removeSessionCompare(sessionId);
    }else{
      this.addSessionCompare(sessionId);
    }
    
  }

  addSessionCompare(sessionId : number, flagReload=true){
    this.compareSessionsIds.push(sessionId);
    this.http.post(this.apiURL + "/imgcollection/compare/" + sessionId, {}).subscribe(
      (data: any) => {    
        try{
          console.log("successfully added to compare"); 
          if (flagReload){

              this.getSessionCompareHist();
           
          }
          
        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.handleAPIError(error);
      }
    )
  }

  removeSessionCompare(sessionId : number){
    this.compareSessionsIds.splice(this.compareSessionsIds.indexOf(sessionId), 1);

    let index = this.compareSessions.findIndex(x => x["sessionId"] === sessionId);
    this.compareSessions.splice(index, 1);

  }

  removeSessionCompareFromHist(sessionId : number){
    this.http.delete(this.apiURL + "/imgcollection/compare/" + sessionId, {}).subscribe(
      (data: any) => {    
        try{
          console.log("successfully removed from compare")
        }
        catch(err){
          console.log(err);
          return null;
        } 

      },
      error => {
        this.handleAPIError(error);
      } 
    )
  }





  // #### stream #####


  getStream(top = 10, skip = 0, flagIsUserId = false){

    let payload = {};

    if (flagIsUserId){
      var httpParams = new HttpParams().set("flagIsUserId" , "1").set("top" , top.toString()).set("skip" ,skip.toString());
    }else{
      var httpParams = new HttpParams().set("top" , top.toString()).set("skip" ,skip.toString());
    }

    payload["params"] = httpParams
    
    return this.http.get(this.apiURL + '/stream', payload);
  }


  isSessionCompared(sessionId : number){
    if (this.compareSessionsIds.indexOf(sessionId) > -1){
      return true;
    }else{
      return false;
    }
  }



  // functions for the admin area, only relevant within the development environemnt as posting to index is done via server-side

  getSearchItemMeta(options?){

    return this.http.get(this.apiURL + "/admin/searchmeta", {headers: {'api_secret' : this.cfg.api_secret}, params: options })
  }

  approveSearchItemMeta(SearchItemMeta){
    return this.http.post(this.apiURL + "/admin/searchmeta", SearchItemMeta, {headers: {'api_secret' : this.cfg.api_secret} });
  }

  rejectSearchItemMeta(id : string){
    return this.http.delete(this.apiURL + "/admin/searchmeta/" + id, {headers: {'api_secret' : this.cfg.api_secret} });
  }

  getSearchMetaData(){
    return this.http.get(this.apiURL + '/' + "search/filtermeta")
  }

  getGroupLabelsInfo(options?){ 
    return this.http.get(this.apiURL + '/' + "admin/searchmeta/grouplabels", {headers: {'api_secret' : this.cfg.api_secret}, params: options})
  }




  handleAPIError(error){

    console.log("Error in API call")
    console.log(error);

    let errorCode = error.status;

    let isCustomMsg = false;

    switch (errorCode) {
        case 401:
        this.notify.toastError("API_ERROR_404");
          isCustomMsg = true;
          break;
    }

    if (!isCustomMsg){
      this.notify.toastError("API_ERROR");
    }
    
    this.spinner.hide();

  }



}

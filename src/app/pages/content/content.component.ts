import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { CommentDialogComponent } from '../../comp/comment-dialog/comment-dialog.component';

import { LinkUsernameDirective } from '../../directives/link-username/link-username.directive';

import { DomSanitizer } from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { UtilService } from '../../services/util.service';
import { ApiService } from '../../services/api.service';
import { Session, Comment, PurchaseTag } from '../../models/datamodel';
import { NotificationService } from '../../services/notification.service';
import { AuthenticationService } from '../../services/auth.service';
import { VoteHandler } from '../../comp/vote/index';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss',
  '../../app.component.scss']
})
export class ContentComponent implements OnInit {

  public purchaseTags : PurchaseTag [] = [];

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

  public commentList : any;

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

  public sessions : any = [];

  addToCollection = new FormControl();

  public collectionList = ['Wedding-Dress', 'CasualMine'];

  public panelStep : number = 1;
  previousUrl: string; 

  selectedSessionId : number;
  commentText : string = "";


  constructor(
    private dialog : MatDialog, 
    private san : DomSanitizer,
    private location: Location,
    private route : ActivatedRoute, 
    private router: Router, 
    public util : UtilService, 
    public api : ApiService, 
    private notify: NotificationService, 
    private auth: AuthenticationService, 
    private voteHdl : VoteHandler) { 

      
      router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((e : any)=> {
        console.log('prev:', this.previousUrl);
        this.previousUrl = e.url;
      });

    }

  ngOnInit() {

    // this.dragElement(document.getElementById(("addComment")));
    // this.dragElement(document.getElementById(("addTag")));

    this.route.queryParams
      .filter(params => params.session)
      .subscribe(params => {

        console.log(params); // {order: "popular"}

        let sessions = params.session;

        this.loadSessions(sessions);


        console.log(sessions); // popular
      });

  }

  updateURL (){

    let snapshot	= this.route.snapshot as any;
    let state = snapshot._routerState.url;

    let base = state.substring(0,state.indexOf("?"));

    let parameters= "?"

    for (var i=0; i<this.sessions.length; i++){
      parameters += "session=" + this.sessions[i].getId() + "&";
    }

    this.location.replaceState(base + parameters);
  }


  loadSessions (sessions){
    this.api.getSessions(sessions).subscribe(
      (data: any) => {    
        
        try{
          let sessionArr = [];
          let first = true;

          data.forEach(element => {
            let s = new Session(element);
            s.castTags();

            if (first){
              this.selectSession(s);
            }

            first = false;
            
            sessionArr.push(s);

          });
          console.log(sessionArr);
          this.sessions = sessionArr;

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

  loadOneSession(sessionId){
    let index = this.sessions.findIndex(x => x["sessionId"] === sessionId);

    if (index == -1){
      let sessions = [sessionId]; 
      let self = this; 
      

      this.api.getSessions(sessions).subscribe(
        (data: any) => {    
          
          try{
  
            data.forEach(element => {
              let s = new Session(element);
              s.castTags();
              self.sessions.push(s);
            });

            this.updateURL();
  
            this.api.addSessionCompare(sessionId, false);
  
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

  closeCompareItem(sessionId : number){
    let index = this.sessions.findIndex(x => x["sessionId"] === sessionId);
    this.sessions.splice(index, 1);

    this.updateURL();

    this.selectSession(this.sessions[0]);

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

  loadLocation(tag : PurchaseTag){
    return tag.getLocation();
  }

  hoverInTag(tag){
    tag["isActive"] = true;
  }

  hoverOutTag(tag){
    tag["isActive"] = false;
  }

  close(){

    const loc = this.location;

    let currentPath = document.URL; 
    let referrerPath = document.referrer;

    if (this.util.extractHostname(currentPath) == this.util.extractHostname(referrerPath) && referrerPath && referrerPath.length > 0 ){
      loc.back();
    }
    else{
      this.router.navigate(['/']);  
    }
  }

  loadSessionFromHistory(session: Session){

    if (this.sessions.length < 3){
      this.loadOneSession(session.getId());
    }else{ 
      this.notify.toastInfo('NOTIFY.CONTENT_DISPLAY_LIMIT_SESSIONS');
    }
    
  }

  isSessionSelected(session : Session){
    if (session.getId() == this.selectedSessionId){
      return true;
    }else{
      return false;
    }
  }

  selectSession(session : Session){
    this.selectedSessionId = session.getId();
    this.commentList = session.comments;
    this.purchaseTags = session.tags;

  }

  getSessionSizeClass(){
    let amount = this.sessions.length; 

    if (amount > 0){
      let c = 12 / amount;
      return "s-" + c + " m-" + c + " l-" + c;
    }else{
      return "s-12 m-12 l-12";
    }
    
  }

  getCurrentSession() : Session{
    try{
      let index = this.sessions.findIndex(x => x["sessionId"] === this.selectedSessionId);
      return this.sessions[index]
    }
    catch(err){
      return;
    }

  }


  getCurrSessionUserId(){

    try{
      let currentSession = this.getCurrentSession() ; 
      return currentSession.getUserId();

    }
    catch(err){
      return;
    }

  }

  getCurrSessionUserName(){

    try{
      let currentSession = this.getCurrentSession() ; 
      return currentSession.getUserName();

    }
    catch(err){
      return;
    }

  }

  getCurrSessionUserAvatar(){

    try{
      let currentSession = this.getCurrentSession() ; 
      return currentSession.userAvatarPath;

    }
    catch(err){
      return;
    }

  }


  getCurrSessionVote(){
    try{
      
      return this.getCurrentSession().voteAvg;

    }
    catch(err){
      return;
    }
  }

  getCurrSessionCollectionTitle(){
    try{
      
      return this.getCurrentSession().getCollectionTitle();

    }
    catch(err){
      return;
    }
  }

  getCurrSessionCollectionId(){
    try{
      
      return this.getCurrentSession().getCollectionId();

    }
    catch(err){
      return;
    }
  }

  
  addComment(){

    let currentSession = this.getCurrentSession();
    console.log(this.commentText);

    let comment = new Comment({
      "commentText" : this.commentText, 
      "sessionId" : currentSession.getId(), 
      "commentUserId" : this.auth.getUserId(), 
      "commentUserName" : "Testusername"
    }); 

    currentSession.addComment(comment);

    this.commentText = "";

    this.api.addComment(comment, currentSession).subscribe(
      (data: any) => {    
        
        try{
          this.notify.toastInfo("NOTIFY.COMMENT_ADDED"); 
          currentSession.commentCnt++;
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

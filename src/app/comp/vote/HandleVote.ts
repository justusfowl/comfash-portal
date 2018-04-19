import { Injectable } from '@angular/core';
import { Session, Vote } from '../../models/datamodel';
import { AuthenticationService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';


@Injectable()
export class VoteHandler {

    constructor(
        private auth: AuthenticationService, 
        private api: ApiService
    ) {
    
         }

    handleVote(voteType, session: Session){
        let newVote = new Vote({
            sessionId: session.getId(),
            voteType : voteType,
            voteChanged : new Date(),
            userId : this.auth.getUserId()
          }); 
      
          if (voteType != -1){
            this.addVote(newVote, session);
            session.setMyVote(newVote);
          }else{
            this.removeVote(newVote, session);
            session.removeMyVote();
          }
    }

    addVote(vote : Vote, session: Session){
        this.api.upsertVote(vote, session).subscribe(
          (data: any) => {    
            
            try{
            console.log(data)
    
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
    
      removeVote(vote: Vote, session: Session){
        
        this.api.deleteVote(vote, session).subscribe(
          (data: any) => {    
            
            try{
            console.log(data)
    
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

      getSessionVoteType(session : Session){
        return session.getMyVoteType();
      }

      getVoteStyleClass(vote : number){

        let iconClass = '';

        switch(vote) {
            case -50:
                iconClass = "icon-sli-dislike";
                break;
            case 25:
                iconClass = "icon-sli-emotsmile";
                break;
            case 75:
                iconClass = "icon-sli-like";
                break;
            case 100:
                iconClass = "icon-sli-diamond";
                break;
            default:
                iconClass = 'icon-sli-like'
        }

        return iconClass;


    }

}
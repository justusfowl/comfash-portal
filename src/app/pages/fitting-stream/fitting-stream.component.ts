import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { NotificationService } from '../../services/notification.service';
import { Message } from '../../models/datamodel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fitting-stream',
  templateUrl: './fitting-stream.component.html',
  styleUrls: ['./fitting-stream.component.scss',
  '../../app.component.scss']
})
export class FittingStreamComponent implements OnInit {


  activityItems : any = [];
  private top : number = 5; 
  private skip : number = 0;


  constructor(
    public api: ApiService,
    public util: UtilService, 
    public notify: NotificationService, 
    private router: Router

  ) { }

  ngOnInit() {

    this.getActivities();

  }

  messageClick(message : Message){
    message.setReadStatus(0);
    this.api.updateMessageReadStatus(message);
    this.notify.navigateFromMessage(this.router, message.getLinkUrl());
  }

  onScroll() {
    console.log("load more activities...")
    this.getMoreActivities();
  }

  getActivities(reloadAll = false){

    if (reloadAll){
      this.top = 10; 
      this.skip = 0;
    }

    this.api.getStream(this.top, this.skip).subscribe(
      (data : any) => {
        
        try{
          if (reloadAll){
            this.activityItems = data;
          }else{
            data.forEach(element => {
              this.activityItems.push(element);
            });
          }

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

  getMoreActivities(){

    this.skip = this.skip + this.top;
    this.getActivities();

  }


}

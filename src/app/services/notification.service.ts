import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Message } from '../models/datamodel';

@Injectable()
export class NotificationService {


  constructor(
    private _service: NotificationsService, 
    private translate : TranslateService
  ) { }

  toastInfo(messageKey : string){
    let translatedMsg = this.translate.instant(messageKey); 
 
    const toast = this._service.info('Info', translatedMsg , {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  toastError(messageKey : string){
    let translatedMsg = this.translate.instant(messageKey); 
 
    const toast = this._service.error('Error', translatedMsg , {
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      clickIconToClose: true
    });
  }

  getMessageBody(messageKey : string){
    let key = "NOTIFY." + messageKey;
    let translatedMsg = this.translate.instant(key); 

    return translatedMsg;
  }



  navigateFromMessage(router : Router, linkUrl){

    let targetPage = linkUrl.targetPage;

    switch(targetPage) {
        case "ContentPage":
          router.navigate(["/content"], { queryParams: { session: linkUrl.params.compareSessionIds } })
          break;
        case "ImgCollectionPage":
          console.log("targetPath: imgcollection")
          router.navigate([""]);
          break;
        default:
          router.navigate([""]);
    }


  }


}

import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable()
export class UtilService {

  constructor(
      private cfg : ConfigService
  ) { }

  extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }

    wrapHostPath(path){

        return this.cfg.getHostBase() + "/data" + path;

    }

    formatPrcVote(votePrc){
        if (votePrc > 0){
            return votePrc.toFixed(0) + "%";
        }else{
            return "";
        }
        
    }

    try(callback){
        try{
            callback()
        }catch(err){
            
            console.log("error in callback..");
            return;
        }
    }

    hiddenFeature(message : string){

        if (!this.cfg.getIsProd()){
            console.info('there is one hidden feature to untoggle: ', message);
        }
        
        return true;
    }

    formatDateDiffToNow(inputDateStr: string){

        let inputDate = new Date(inputDateStr)

        let desc = "sec";
        let text = " ago"
    
        let now = new Date(); 
        
        // get diff in seconds
        let diff = (now.getTime() - inputDate.getTime()) / 1000;

        if (diff / 60 < 1){
            return diff.toFixed(0) + desc + text; 
        }

        diff = diff / 60;

        if (diff / 60 < 1){
            desc = "min"
            return diff.toFixed(0) + desc + text; 
        }

        diff = diff / 60;

        if (diff / 24 < 1){
            desc = "h"
            return diff.toFixed(0) + desc + text; 
        }

        diff = diff / 24; 
        desc = "d"
        

        return diff.toFixed(0) + desc + text; 

    }

    formatCnt(cnt){

        if (cnt == null){
            return "0";
        }else{
            return cnt;
        }
    }

}

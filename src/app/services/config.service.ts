import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class ConfigService {

    private hostURL : string;
    private hostPort : string;
    private apiVersion : string;
    private apiBase : string = "/api/v";
    private apiProtocol : string = 'https';

    public autoPlayStream : boolean = false;

    private environmentName : string;

    private isProd : boolean = false;

    public auth_clientId : string;
    public auth_domain : string;
    public auth_responseType : string;
    public auth_audience : string;
    public auth_redirectUri : string;
    public auth_scope : string;

    public api_secret : string;


    constructor() {

        this.environmentName = environment.ENV.mode;
        this.hostURL = environment.ENV.hostURL;
        this.hostPort = environment.ENV.hostPort;
        this.apiVersion = environment.ENV.apiVersion;

        this.auth_clientId = environment.ENV.auth.clientID;
        this.auth_domain = environment.ENV.auth.domain
        this.auth_responseType = environment.ENV.auth.responseType;
        this.auth_audience = environment.ENV.auth.audience;
        this.auth_redirectUri = environment.ENV.auth.redirectUri;
        this.auth_scope = environment.ENV.auth.scope;
        this.api_secret = environment.ENV.auth.api_secret;
    


        console.log("Environment loaded: " + this.environmentName);

        if (this.environmentName == "prod"){
            this.isProd = true;
        }else{
            this.isProd = false;
        }

        this.isProd = true;

    }

    getEnvironment(){
        return this.environmentName;
    }

    getIsProd(){
        return this.isProd;
    }

    getHostURL (){
        return this.hostURL;
        // return this.userName; 
    }

    getHostUrlPort(){
        return this.hostURL + ":" + this.hostPort
    }

    getAPIv (){
        return this.apiVersion;
        // return this.userId;
    }

    getAPI(){
        return this.apiBase + this.apiVersion;
    }

    getHostBase (){
        return this.apiProtocol + "://" + this.hostURL + ":" + this.hostPort;
        // return this.userName; 
    }

    getAPIBase () : string {
        if (this.hostPort != "443"){
            return this.apiProtocol + "://" + this.hostURL + ":" + this.hostPort + this.getAPI();
        }else{
            return this.apiProtocol + "://" + this.hostURL + this.getAPI();
        }
    }

}

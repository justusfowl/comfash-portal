

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';


@Injectable()
export class ApiService {

  tmpLinkpreviewKey = "5abb71440a8df5d2a47cdbbcc3d3af68f7d4003f796b5";

  constructor(public http: HttpClient) { }

  getUrlPreview(webUrl: string){

    let url = "https://api.linkpreview.net?key=" + this.tmpLinkpreviewKey +"&q=" + webUrl 

    return this.http.get(url);

  }


}

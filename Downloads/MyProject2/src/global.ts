'use strict';
import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//export let backend = "https://rude-towns-know.loca.lt/TMC";
//  export let backend = 'https://a5115199f60b4c95bd5db53c3440b7f7.loophole.site/TMC';
 export let backend = 'https://api.remoteapps.com/';
//  export let backend = 'http://localhost:3000/';
// export let backend = 'https://2f9246074e066853379188f8c6dba61f.loophole.site/TMC';
export const raKey = 'ra-8bfc6186-43aa-42dc-8f7b-898fc8674d56';

 
// export let backend = 'https://1684e7908f610694ee2f5150537154b3.loophole.site';
// export const signalr = "https://signalr.remoteapps.com";

export const ServerImage = 'https://web.remoteapps.com/image/Company/LoginLogo/';
export const CardImage = 'https://web.remoteapps.com/image/Company/CompanyCard/';
export const tameenImage =  'https://web.remoteapps.com/image/Company/TameenLogo/';

export const SImage = 'https://web.remoteapps.com/image';
export const noconnection =
  'Please check your Internet Connection and try again later'; 
export const httpError = 'Something wrong happened, Please try again later';
export const reconnect = 'Connection Lost, Please Try Again';
export let backgroundColor = '';

export const setBackend = (api:string) => {  
  backend = api; 
};    

export const setBackgroundColor = (color:string) => {   
  backgroundColor = color;
}; 
     
@Injectable()
export class CustomHttp {
  isIos = true; 
  requestOptions = {};
  constructor(
    public platform: Platform, 
    private http: HttpClient
  ) {
    this.isIos = this.platform.is('ios');
  }

  post(url: string, body: FormData, headers = {}): Promise<any> {
    if (url[22] === '/' && (window as any).Ionic.isLiveReload) {
      url = url.substring(0, 21) + url.substring(22);
    }
  
    const completeUrl = `${backend}${url}`; // Construct complete URL
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
  
    return this.http
      .post(completeUrl, body, httpOptions)
      .toPromise()
      .then((data: any) => JSON.parse(data))
      .catch((error) => {
        console.error('Error:', error);
        throw error; // Re-throw for component handling
      });
  }
  

  showLogDebug(fdata:FormData) {
    console.log('****** New Request ******');
    fdata.forEach((value: any, key: string) => {
      console.log('[' + key + ']', value);
    });
  }

  get(url: string, body = {}, headers = {}): Promise<any> {
    const completeUrl = `${backend}${url}`; // Construct complete URL
    const httpOptions = {
      headers: new HttpHeaders(headers)
    };
  
    return this.http
      .get(completeUrl, httpOptions)
      .toPromise()
      .then((data: any) => JSON.parse(data))
      .catch((error) => {
        console.error('Error:', error);
        throw error; // Re-throw for component handling
      });
  }

  postData(url: string, data: any): Observable<any> {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
  
    return this.http.post(url, formData);
  }
}
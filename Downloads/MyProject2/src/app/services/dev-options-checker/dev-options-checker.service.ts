import { Injectable } from '@angular/core';

declare var cordova: any;

@Injectable({
  providedIn: 'root'
})
export class DevOptionsCheckerService {

  constructor() { }

  isDevOptionsEnabled(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        console.log('Cordova:', cordova);
        console.log('Cordova plugins:', cordova.plugins);

        if (cordova && cordova.plugins && cordova.plugins.devoptionschecker) {
          console.log('DevOptionsChecker plugin:', cordova.plugins.devoptionschecker);

          // Call the check method with success and error callbacks
         const result= cordova.plugins.devoptionschecker.check()
            return
           
        } else {
          console.error('DevOptionsChecker plugin not available');
          reject('DevOptionsChecker plugin not available');
        }
      }, false);
    });
  }
}

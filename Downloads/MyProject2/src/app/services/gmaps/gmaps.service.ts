import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GmapsService {
  private isScriptLoaded = false;

  constructor() { }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isScriptLoaded) {
        // Script is already loaded, return the existing promise
        this.resolveGoogleMaps().then(resolve).catch(reject);
        return;
      }

      // Mark script as loaded to prevent multiple inclusions
      this.isScriptLoaded = true;

      const win = window as any;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=geometry,places`;

      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        this.resolveGoogleMaps().then(resolve).catch(reject);
      };

      script.onerror = () => {
        reject('Google Maps SDK failed to load.');
      };
    });
  }

  private resolveGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      const win = window as any;
      const googleMaps = win.google?.maps;
      if (googleMaps) {
        resolve(googleMaps);
      } else {
        reject('Google Maps SDK is not available.');
      }
    });
  }
}

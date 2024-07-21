// after finishing the code and going to the next task which was the drag and drop now i want to go back map and make the map code clean to giver it to hussin

//map working on both emulator and browser and live but i want the map always to move center with user location

import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { GmapsService } from '../services/gmaps/gmaps.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-second',
  templateUrl: './second.page.html',
  styleUrls: ['./second.page.scss'],
})
export class SecondPage implements OnInit, OnDestroy {
  @ViewChild('map', { static: true }) mapElementRef: ElementRef | undefined;
  googleMaps: any;
  // center = { lat: 26.066700, lng: 50.557701 };
  map: any;
  watchId: any; // Variable to store the watch position ID
  userLocation = { lat: 0, lng: 0 };
  marker: any;

  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private alertController: AlertController

  ) { }

  ngOnDestroy(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngOnInit(): void {
    console.log();
  }

  ngAfterViewInit() {
    this.loadMap();
  }


  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;


      // Get user's current position with high accuracy
      navigator.geolocation.getCurrentPosition(

        (position) => {
          const userPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.lat = userPosition.lat();
          this.userLocation.lng = userPosition.lng();
          console.log('Latitude:', this.userLocation.lat);
          console.log('Longitude:', this.userLocation.lng);

          // Set up initial map centered on this.userLocation
          const userLoc = new googleMaps.LatLng(this.userLocation.lat, this.userLocation.lng);
          this.map = new googleMaps.Map(mapEl, {
            center: userLoc,
            zoom: 16,
            mapTypeControl: false,
            streetViewControl: false,

          });
          console.log("wooow")
          this.map.setCenter(userLoc);
          this.addMarker(userLoc);
          // this.presentAlert("im in getCurrent location");
          // this.presentAlert(this.userLocation.lat + " " + this.userLocation.lng);
        },
        (error) => {
          this.presentAlert('Error getting current position:');
        },
        {
          enableHighAccuracy: true, // Enable high accuracy mode
        }
      );




      // i think it needs some updation
      // this.watchId = navigator.geolocation.watchPosition(
      //   (watchPosition) =>{
      //     const updateLocation = new googleMaps.LatLng(watchPosition.coords.latitude, watchPosition.coords.longitude);
      //     this.userLocation = updateLocation;
      //       // this.moveMarker(updateLocation); // Update marker position
      //       this.updateMarker(updateLocation); // Update marker position
      //       console.log("watchPosition running", updateLocation);


      //   }
      // )

      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(this.userLocation); // Assuming this.userLocation might be undefined initially

    } catch (e) {
      console.error('Error loading Google Maps:', e);
      // Handle errors related to loading Google Maps here
    }
  };


  addMarker(maplocation: any) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location.svg',
      scaledSize: new googleMaps.Size(50, 50),
    };
    const marker = new googleMaps.Marker({
      position: maplocation,
      map: this.map,
      icon: icon,
      // draggable:true,
      animation: googleMaps.Animation.BOUNCE
    });
  }
  moveMarker(newPosition: any) {
    if (this.marker) {
      this.marker.setCenter(newPosition);
    } else {
      this.addMarker(newPosition);
    }
  }

  updateMarker(newPosition: any) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location.svg',
      scaledSize: new googleMaps.Size(50, 50),
    };

    if (this.marker) {
      // Marker exists, so move it to the new position
      this.marker.setCenter(newPosition);
    } else {
      // Marker doesn't exist, create a new one
      this.marker = new googleMaps.Marker({
        position: newPosition,
        map: this.map,
        icon: icon,
        animation: googleMaps.Animation.DROP
      });
    }
  }

  async confirmLocation() {
    if (this.userLocation && this.userLocation.lat && this.userLocation.lng) {
      const message = `Latitude: ${this.userLocation.lat}, Longitude: ${this.userLocation.lng}`;
      this.presentAlert(message);
    } else {
      console.error('Marker position is not available.');
      // Handle case where marker position is not available
    }
  }

  async presentAlert(message: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  gOnDestroy() {
    this.googleMaps.event.remoteAllListeners();
  }

  stopWatch() {
    // Cancel the updates when the user clicks a button.
    navigator.geolocation.clearWatch(this.watchId);
  }

}

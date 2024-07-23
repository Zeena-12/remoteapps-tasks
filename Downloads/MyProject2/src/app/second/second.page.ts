import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { GmapsService } from '../services/gmaps/gmaps.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';


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

  private locationInterval: any;


  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private alertController: AlertController,
    private navCtrl: NavController

  ) { }

  ngOnDestroy(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngOnInit(): void {
    console.log();
    // this.startLocationUpdates();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
  // this.presentAlert("loading the map");
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
          // this.addMarker(userLoc);
          // this.presentAlert("im in getCurrent location");
          // this.presentAlert(this.userLocation.lat + " " + this.userLocation.lng);
        },
        (error) => {
          // this.presentAlert('Error getting current position:');
        },
        {
          enableHighAccuracy: true, // Enable high accuracy mode
          timeout: 100000,
        }
      );

      // i think it needs some updation
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const watchPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.lat = watchPosition.lat();
          this.userLocation.lng = watchPosition.lng();
          console.log('Latitude from watch:', this.userLocation.lat);
          console.log('Longitude from watch:', this.userLocation.lng);


          // this.moveMarker(updateLocation); // Update marker position
          this.addMarker(watchPosition); // Update marker position
          console.log("watchPosition running", watchPosition);
          // Center the map on the new position
          this.map.setCenter(watchPosition);


        },
        (error) => {
          console.error('Error watching position:', error);
        },

        {
          enableHighAccuracy: true,
          timeout: 100000,
        }
      )

      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(this.userLocation); // Assuming this.userLocation might be undefined initially

    } catch (e) {
      console.error('Error loading Google Maps:', e);
      // Handle errors related to loading Google Maps here
    }
  };


  // addMarker(maplocation: any) {
  //   console.log("calling addMarker")
  //   let googleMaps: any = this.googleMaps;
  //   const icon = {
  //     url: 'assets/icons/location.svg',
  //     scaledSize: new googleMaps.Size(50, 50),
  //   };
  //   this.marker = new googleMaps.Marker({
  //     position: maplocation,
  //     map: this.map,
  //     icon: icon,
  //     // draggable:true,
  //     animation: googleMaps.Animation.DROP
  //   });
  // }
  // moveMarker(newPosition: any) {
  //   console.log("calling moveMarker");
  //   if (this.marker) {
  //     this.marker.setCenter(newPosition);
  //   } else {
  //     this.addMarker(newPosition);
  //   }
  // }

  addMarker(maplocation: any) {
    console.log("calling addMarker");
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location.svg',
      scaledSize: new googleMaps.Size(50, 50),
    };

    // Check if a marker already exists and remove it
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Add the new marker
    this.marker = new googleMaps.Marker({
      position: maplocation,
      map: this.map,
      icon: icon,
      // draggable: true,
      animation: googleMaps.Animation.DROP
    });
  }


  // updateMarker(newPosition: any) {
  //   console.log("calling updateMarker");
  //   let googleMaps: any = this.googleMaps;
  //   const icon = {
  //     url: 'assets/icons/location.svg',
  //     scaledSize: new googleMaps.Size(50, 50),
  //   };

  //   if (this.marker) {
  //     // Marker exists, so move it to the new position
  //     this.marker.setPosition(newPosition);
  //     console.log("calling iffffffffffffff", this.marker.setPosition(newPosition));
  //   } else {
  //     console.log("calling elseeeeeeeeeeeeeeeeeeeeee");
  //     // Marker doesn't exist, create a new one
  //     this.marker = new googleMaps.Marker({
  //       position: newPosition,
  //       map: this.map,
  //       icon: icon,
  //       // animation: googleMaps.Animation.BOUNCE //just for testing
  //     });
  //   }
  // }

  async confirmLocation() {
    // use this function to take the lat and lng of the user and pass it to the map of the place to check if he is in place or no
    if (this.userLocation && this.userLocation.lat && this.userLocation.lng) {
      const message = `Latitude: ${this.userLocation.lat}, Longitude: ${this.userLocation.lng}`;
      this.presentAlert(message);
    } else {
      console.error('Marker position is not available.');
      
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

  refreshPage() {
    window.location.reload();
  }
}

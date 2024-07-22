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
  map: any;
  watchId: any; // Variable to store the watch position ID
  userLocation = { lat: 0, lng: 0 };
  marker: any;

  constructor(
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    console.log('Component initialized');
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  ngOnDestroy(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;

      if (!mapEl) {
        console.error('Map element not found');
        return;
      }

      // Get user's current position with high accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.lat = userPosition.lat();
          this.userLocation.lng = userPosition.lng();
          console.log('Latitude:', this.userLocation.lat);
          console.log('Longitude:', this.userLocation.lng);

          // Set up initial map centered on this.userLocation
          this.map = new googleMaps.Map(mapEl, {
            center: userPosition,
            zoom: 16,
            mapTypeControl: false,
            streetViewControl: false,
          });

          this.addMarker(userPosition);
        },
        (error) => {
          this.handleGeolocationError(error);
        },
        {
          enableHighAccuracy: true, // Enable high accuracy mode
          timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0 // No cached position
        }
      );

      // Watch the position and update marker and map center
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const watchPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.lat = watchPosition.lat();
          this.userLocation.lng = watchPosition.lng();
          console.log('Latitude from watch:', this.userLocation.lat);
          console.log('Longitude from watch:', this.userLocation.lng);

          // Update marker and center map
          this.updateMarker(watchPosition);
          this.map.setCenter(watchPosition);
        },
        (error) => {
          this.handleGeolocationError(error);
        },
        {
          enableHighAccuracy: true, // Enable high accuracy mode
        }
      );

      this.renderer.addClass(mapEl, 'visible');
    } catch (e) {
      console.error('Error loading Google Maps:', e);
    }
  }

  addMarker(maplocation: any) {
    console.log("calling addMarker");
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location.svg',
      scaledSize: new googleMaps.Size(50, 50),
    };
    this.marker = new googleMaps.Marker({
      position: maplocation,
      map: this.map,
      icon: icon,
    });
  }

  updateMarker(newPosition: any) {
    console.log("calling updateMarker");
    if (this.marker) {
      // Marker exists, so move it to the new position
      this.marker.setPosition(newPosition);
    } else {
      // Marker doesn't exist, create a new one
      this.addMarker(newPosition);
    }
  }

  async confirmLocation() {
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

  handleGeolocationError(error: any) {
    let message = 'Error getting current position: ';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message += 'Permission denied.';
        break;
      case error.POSITION_UNAVAILABLE:
        message += 'Position unavailable.';
        break;
      case error.TIMEOUT:
        message += 'Timeout.';
        break;
      default:
        message += 'Unknown error.';
        break;
    }
    console.error(message);
    this.presentAlert(message);
  }
}

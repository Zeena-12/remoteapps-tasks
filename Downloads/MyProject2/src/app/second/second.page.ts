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
  map: any;
  watchId: any;
  userLocation = { lat: 0, lng: 0 };

  // Location from API
  // workLocationFromAPI = [
  //   { lat: 26.23643764228371, lng: 50.54352463551613 },
  //   { lat: 26.23603826536928, lng: 50.5426368243322 },
  //   { lat: 26.235655728363604, lng: 50.542827261172256 },
  //   { lat: 26.235607610412135, lng: 50.54331542321297 },
  //   { lat: 26.23582654693048, lng: 50.54379285641762 },
  //   { lat: 26.23643764228371, lng: 50.54352463551613 }
  // ];
  workLocationFromAPI = [
 {lat: 26.114377200805777, lng: 50.57535602275675},
 { lat: 26.112387844250406, lng: 50.575495497625525 },
 { lat: 26.11246491438421, lng: 50.57237877075022 },
 { lat: 26.11246491438421, lng: 50.57218565170115 },
 { lat: 26.11246491438490, lng: 50.57218565170115 }
  ];


  marker: any;
  polyline: any;
  path: any[] = [];
  polygon: any;

  private locationInterval: any;

  notFound: boolean = false;
  notInLocation: boolean = false;
  confirmPunch: boolean = false;

  testTrue = true;

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
    this.showBox(0); // Show default box initially
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef?.nativeElement;

      // Initialize map with a default location (e.g., from API)
      const defaultLocation = new googleMaps.LatLng(this.workLocationFromAPI[1].lat, this.workLocationFromAPI[1].lng);
      console.log("defualt location: ", defaultLocation)
      this.map = new googleMaps.Map(mapEl, {
        center: defaultLocation,
        zoom: 19, // Adjust the zoom level as needed
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        scaleControl: false,
        fullscreenControl: false
      });

      // Initialize polyline
      this.polyline = new googleMaps.Polyline({
        path: this.path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      this.polyline.setMap(this.map);

      // Initialize polygon (square) around the user's location
      this.updatePolygon(this.workLocationFromAPI);

      // Add marker for initial position
      // this.addMarker(defaultLocation);

      // Get user location and update map
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
          this.userLocation.lat = userPosition.lat();
          this.userLocation.lng = userPosition.lng();
          console.log('Latitude:', this.userLocation.lat);
          console.log('Longitude:', this.userLocation.lng);

          // Center the map on the user's location and add/update marker
          this.map.setCenter(userPosition);
          this.addMarker(userPosition);

          // Check if the user is in the location
          this.updateLocationStatus();

          // Watch for location changes
          this.watchId = navigator.geolocation.watchPosition(
            (position) => {
              const watchPosition = new googleMaps.LatLng(position.coords.latitude, position.coords.longitude);
              this.userLocation.lat = watchPosition.lat();
              this.userLocation.lng = watchPosition.lng();
              console.log('Latitude from watch:', this.userLocation.lat);
              console.log('Longitude from watch:', this.userLocation.lng);

              // Update marker and polyline
              this.addMarker(watchPosition);
              this.path.push(watchPosition);

              // Center the map on the new position
              this.map.setCenter(watchPosition);

              // Check if the user is in the location
              this.updateLocationStatus();
            },
            (error) => {
              console.error('Error watching position:', error);
            },
            {
              enableHighAccuracy: true,
              timeout: 100000,
            }
          );
        },
        (error) => {
          console.error('Error getting current position:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 100000,
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
      url: 'assets/icons/pin.svg', // Ensure this path is correct
      scaledSize: new googleMaps.Size(90, 90), // Adjust size as needed
    };

    if (this.marker) {
      this.marker.setMap(null);
    }

    this.marker = new googleMaps.Marker({
      position: maplocation,
      map: this.map,
      icon: icon,
    });
  }

  updatePolygon(points: any) {
    let googleMaps: any = this.googleMaps;

    const bounds = points.map((point: Point) => new googleMaps.LatLng(point.lat, point.lng));

    if (this.polygon) {
      this.polygon.setMap(null);
    }

    this.polygon = new googleMaps.Polygon({
      paths: bounds,
      strokeColor: '#00ABE9',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#C9E8F4',
      fillOpacity: 0.35,
    });
    this.polygon.setMap(this.map);
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

  gOnDestroy() {
    this.googleMaps.event.removeAllListeners();
  }

  stopWatch() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  refreshPage() {
    window.location.reload();
  }

  showBox(boxIndex: number) {
    const boxes = document.querySelectorAll('.bottom-container .box');

    if (boxes.length === 0) {
      console.error('No elements found with the class "box".');
      return;
    }

    if (boxIndex < 0 || boxIndex >= boxes.length) {
      console.error('Box index out of range:', boxIndex);
      return;
    }

    boxes.forEach(box => box.classList.remove('show'));

    const selectedBox = boxes[boxIndex];
    if (selectedBox) {
      selectedBox.classList.add('show');
    } else {
      console.error('Selected box is undefined.');
    }
  }

  updateLocationStatus() {
    if (this.isUserInLocation()) {
      this.showBox(2); // Assuming boxIndex 2 corresponds to the "allow to punch" message
    } else {
      this.showBox(1); // Assuming boxIndex 1 corresponds to the "not allowed to punch" message
    }
  }

  //  check if user in location -- in polygon
  isUserInLocation(): boolean {
    const googleMaps = this.googleMaps;
    try {
      // Create a LatLng object for the user's location
      const userLatLng = new googleMaps.LatLng(this.userLocation.lat, this.userLocation.lng);

      // Convert the polygon points into LatLng objects
      const polygonCoords = this.workLocationFromAPI.map(point => new googleMaps.LatLng(point.lat, point.lng));

      // Create a Polygon using the coordinates
      const polygon = new googleMaps.Polygon({
        paths: polygonCoords
      });
      // Check if the point is inside the polygon
      return googleMaps.geometry.poly.containsLocation(userLatLng, polygon);
    } catch(error) {
      console.error('Error in isUserInLocation:', error);
        return false;
    }

  }

}

interface Point {
  lat: number;
  lng: number;
}


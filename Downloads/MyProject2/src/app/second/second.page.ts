import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { GmapsService } from '../services/gmaps/gmaps.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
// import { LoadingController } from '@ionic/angular';
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
  locationAccuracy: number = 0;

  // @ViewChild('boxNotFound') boxNotFound!: ElementRef;
  // @ViewChild('boxNotAllowed') boxNotAllowed!: ElementRef;
  // @ViewChild('boxAllowed') boxAllowed!: ElementRef;


  currentBox: string = 'notFound'; 
  //  loading!: HTMLIonLoadingElement

// remoteapps location
workLocationFromAPI = [
  { lat: 26.237827690105792, lng: 50.54100449408655 },
  { lat: 26.237387418332933, lng: 50.540938779965686 },
  { lat: 26.237399447638506, lng: 50.540482804433154 },
  { lat: 26.237842125217636, lng: 50.54051633204584 },
  { lat: 26.237827690105792, lng: 50.54100449408655 }
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
    private navCtrl: NavController,
    // private loadingController: LoadingController

  ) { }

  ngOnDestroy(): void {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngOnInit() {
    this.showBox('allowed');
    console.log("calling on init and box is ", this.showBox);
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
          this.locationAccuracy = position.coords.accuracy;

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
              this.locationAccuracy = position.coords.accuracy;
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

  // showBox(boxIndex: number): void {
  //   console.log("calloing showBox");
  //   const boxes = [this.boxNotFound.nativeElement, this.boxNotAllowed.nativeElement, this.boxAllowed.nativeElement];
  //   console.log("boxes: ",boxes);
  //   // Hide all boxes
  //   boxes.forEach(box => box.classList.remove('show'));
  //   // Show the selected box
  //   const selectedBox = boxes[boxIndex];
  //   if (selectedBox) {
  //     selectedBox.classList.add('show');
  //   } else {
  //     console.error('Selected box is undefined.');
  //   }
  
  // }
  showBox(boxType: string): void {
    this.currentBox = boxType;
  }

  updateLocationStatus() {
    if (this.isUserInLocation()) {
      this.showBox('allowed'); // Assuming boxIndex 2 corresponds to the "allow to punch" message
    } else {
      this.showBox('notAllowed'); // Assuming boxIndex 1 corresponds to the "not allowed to punch" message
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


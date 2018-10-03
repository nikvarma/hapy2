import { HttpClient } from "@angular/common/http";
import { Injectable, Output, EventEmitter } from "@angular/core";
import { ConnectivityServiceProvider } from "../connectivity-service/connectivity-service";
import {
  Geolocation,
  Geoposition,
  GeolocationOptions
} from "@ionic-native/geolocation";
import { APIKeys } from "../../config/APIKeys";
import { ToastController } from "ionic-angular";

declare var google;

/*
  Generated class for the GoogleMapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapsProvider {
  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  marker = Array<{}>();
  markerCluster: any;
  locations: any;
  currentMarker: any;
  apiKey: string;
  bubble: any;
  geocoder: any;
  markerIndex: number = 0;
  @Output()
  placeIdOnMapClick: EventEmitter<any> = new EventEmitter();
  infoWindow: any;
  constructor(
    private connectivityService: ConnectivityServiceProvider,
    private geolocation: Geolocation,
    private toastCtrl: ToastController
  ) {
    this.apiKey = APIKeys.googleMap;
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {
    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    return this.loadGoogleMaps();
  }

  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google == "undefined" || typeof google.maps == "undefined") {
        this.disabledMap();

        if (this.connectivityService.isOnline()) {
          window["mapInit"] = () => {
            this.initMap().then(() => {
              resolve(true);
            });
            this.enableMap();
          };
          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src =
              "http://maps.google.com/maps/api/js?key=" +
              this.apiKey +
              "&callback=mapInit&libraries=places";
          } else {
            script.src = "http://maps.google.com/maps/api/js?callback=mapInit";
          }

          document.body.appendChild(script);
        }
      } else {
        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        } else {
          this.disabledMap();
        }

        resolve(true);
      }
      this.addConnectivityListeners();
    });
  }

  enableMap() {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }
  }
  disabledMap() {
    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }
  }

  getCordinates(): any {
    return this.geolocation.getCurrentPosition();
  }

  initMap(): Promise<any> {
    this.mapInitialised = true;
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then(position => {
        let latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        let mapOptions = {
          center: latLng,
          zoom: 15,
          clickableIcons: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);
      });
    });
  }

  removeMarker(): void {}

  removeAllMarker(): void {
    if (this.marker.length > 0) {
      for (let i = 0; i < this.marker.length; i++) {
        this.marker[i]["map"].setMap(null);
        this.marker.splice(i);
      }
      this.markerIndex = 0;
    }
  }

  addMarker(maps: any, latlong: any): void {
    this.marker.push({
      map: new google.maps.Marker({
        position: latlong,
        draggable: true,
        animation: google.maps.Animation.DROP
      })
    });
    console.log(this.marker[this.markerIndex]["map"]);
    this.marker[this.markerIndex]["map"].setMap(maps);

    maps.setCenter(this.marker[this.markerIndex]["map"].getPosition());

    this.marker[this.markerIndex]["map"].setAnimation(
      google.maps.Animation.BOUNCE
    );

    google.maps.event.addListener(
      this.marker[this.markerIndex]["map"],
      "dragend",
      evt => {
        this.locations = evt.latLng;
        this.placeIdOnMapClick.emit(this.locations);
      }
    );

    setTimeout(() => {
      this.marker[this.markerIndex]["map"].setAnimation(null);
      this.markerIndex += 1;
    }, 500);
  }

  closeInfoWindow(): void {
    this.bubble = new google.maps.InfoWindow({});
    this.bubble.close();
  }

  closeInfoWindowOnceMarkerChange(): void {}

  addConnectivityListeners(): void {
    this.connectivityService.watchOnline().subscribe(() => {
      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        } else {
          if (!this.mapInitialised) {
            this.initMap().catch(err => {
              this.toastCtrl
                .create({
                  duration: 1500,
                  message: err,
                  position: "bottom"
                })
                .present();
            });
          }

          this.enableMap();
        }
      }, 2000);
    });
    this.connectivityService.watchOffline().subscribe(() => {
      this.disabledMap();
    });
  }
}

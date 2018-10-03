import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  ViewController,
  ToastController
} from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleMapsProvider } from "../../providers/index";
declare var google;

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-location",
  templateUrl: "location.html"
})
export class LocationPage implements OnChanges, OnDestroy {
  ngOnDestroy(): void {}
  @ViewChild("map")
  mapElement: ElementRef;
  @ViewChild("pleaseConnect")
  pleaseConnect: ElementRef;
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query: string = "";
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  currentPinLocation: any;
  constructor(
    public navCtrl: NavController,
    public zone: NgZone,
    public maps: GoogleMapsProvider,
    public platform: Platform,
    public geolocation: Geolocation,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {
    this.searchDisabled = true;
    this.saveDisabled = true;
  }
  ionViewDidLoad() {
    let mapLoaded = this.maps
      .init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement)
      .then(() => {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.placesService = new google.maps.places.PlacesService(
          this.maps.map
        );
        this.maps.getCordinates().then(position => {
          let latlong = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.maps.addMarker(this.maps.map, latlong);
        });
        this.searchDisabled = false;
      })
      .catch(err => {
        this.toastCtrl
          .create({
            message: err,
            duration: 1500,
            position: "bottom"
          })
          .present();
      });

    this.maps.placeIdOnMapClick.subscribe(res => {
      this.getMapCurrentLngLat(res);
    });
  }

  selectPlace(place) {
    this.places = [];

    let location = {
      lat: null,
      lng: null,
      address: null,
      name: place.name,
      place_id: null,
      addrss_compnonet: null
    };
    console.log(place);
    this.query =
      place.structured_formatting != null
        ? place.structured_formatting.main_text
        : place.name;

    this.placesService.getDetails({ placeId: place.place_id }, details => {
      this.zone.run(() => {
        location.name = details.name;
        location.lat = details.geometry.location.lat();
        location.lng = details.geometry.location.lng();
        location.address = details.formatted_address;
        location.addrss_compnonet = details.address_components;
        location.place_id = details.place_id;
        this.saveDisabled = false;
        this.maps.map.setCenter({ lat: location.lat, lng: location.lng });
        let latlong = { lat: location.lat, lng: location.lng };
        this.maps.addMarker(this.maps.map, latlong);
        this.location = location;
      });
    });
  }

  getPlaceInfo(placeId: string): void {
    this.placesService.getDetails(
      {
        placeId: placeId
      },
      (place, status) => {
        if (status == "OK") {
          console.log(place);
          this.selectPlace(place);
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  getMapCurrentLngLat(locations: any): void {
    var latlng = locations;
    this.maps.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
        } else {
        }
      } else {
        //window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  searchPlace() {
    this.saveDisabled = true;

    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        types: ["geocode"],
        input: this.query
      };

      this.autocompleteService.getQueryPredictions(
        config,
        (predictions, status) => {
          if (
            status == google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            this.places = [];

            predictions.forEach(prediction => {
              this.places.push(prediction);
            });
          }
        }
      );
    } else {
      this.places = [];
    }
  }

  save() {
    console.log(this.location);
    this.viewCtrl.dismiss(this.location);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}

import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ToastController,
  ModalController
} from "ionic-angular";
import { FormControl, FormGroup } from "@angular/forms";
import { CallProvider, Api } from "../../providers";
import { UserProvider } from "../../providers/user/user";

import { Endpoints } from "../../config/Endpoints";
import { Logging } from "../../models/logging";

@IonicPage()
@Component({
  selector: "page-profiledetail",
  templateUrl: "profiledetail.html",
  providers: [UserProvider]
})
export class ProfiledetailPage implements OnInit {
  userDetails: FormGroup;
  userId: string;
  mobilenumber: number;
  countrycode: number;
  isactive: boolean;
  logging: Logging;
  disabledBtn: boolean = false;
  saveinfohidespinner: boolean = true;
  saveplacelivedhidespinner: boolean = true;
  saveworkedhidespinner: boolean = true;
  saveabouthidespinner: boolean = true;
  isProfileSettingsLoad: boolean = false;
  isPlaceSettingsLoad: boolean = false;
  isWorkSettingsLoad: boolean = false;
  isAboutSettingsLoad: boolean = false;
  userComList: Array<{}> = new Array<{}>();
  userLocList: Array<{}> = new Array<{}>();
  ngOnInit(): void {
    this.userDetails = new FormGroup({
      txtusername: new FormControl(),
      txtdob: new FormControl(),
      txtgender: new FormControl(),

      about: new FormGroup({
        txtstatus: new FormControl(),
        txtabout: new FormControl()
      }),

      placelived: new FormGroup({
        txtlng: new FormControl(),
        txtlat: new FormControl(),
        txtplaceslivedcountry: new FormControl(),
        txtplaceslivedcity: new FormControl(),
        txtplaceslivedtxtstate: new FormControl(),
        txtplaceslivedtxtstreet: new FormControl()
      }),

      compdetail: new FormGroup({
        txtcompname: new FormControl(),
        txtlng: new FormControl(),
        txtlat: new FormControl(),
        txtcompnamestartdate: new FormControl(),
        txtcompnameenddate: new FormControl(),
        txtcomplocation: new FormControl(),
        txtcompstatus: new FormControl()
      })
    });

    this.call
      .getValueByKey("userinfo")
      .then(res => {
        this.userId = res.userId;
      })
      .catch(err => {});
    this.call
      .getValueByKey("userdetails")
      .then(res => {
        this.countrycode = res.primarynumbercode;
        this.mobilenumber = res.primarynumber;
        this.isactive = res.isActive;
      })
      .catch(err => {});
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private call: CallProvider,
    private api: Api,
    private user: UserProvider,
    private toast: ToastController,
    private modal: ModalController
  ) {
    this.logging = new Logging();
    this.logging.className = "ProfileDetail";
  }

  close(): void {
    this.viewCtrl.dismiss({ windowpage: "close" });
  }

  openCompMap(): void {
    let locationModal = this.modal.create("LocationPage");
    locationModal.onDidDismiss(data => {
      if (data != null && typeof data != "undefined") {
        this.user.locationsave.comp = {
          address: data.address,
          city: this.searchInChildArray(data.addrss_compnonet, "locality"),
          country: this.searchInChildArray(data.addrss_compnonet, "country"),
          strees: this.searchInChildArray(data.addrss_compnonet, "route"),
          code: this.searchInChildArray(data.addrss_compnonet, "postal_code"),
          state: this.searchInChildArray(
            data.addrss_compnonet,
            "administrative_area_level_2"
          ),
          lat: data.lat,
          lng: data.lng,
          id: null,
          location: this.searchInChildArray(
            data.addrss_compnonet,
            "administrative_area_level_1"
          ),
          isactive: true,
          name: data.name,
          refernceid: "",
          googleplaceId: data.place_id
        };
        this.userDetails.patchValue({ compdetail: { txtcompname: data.name } });
      }
    });
    locationModal.present();
  }

  getUserComp(): void {
    let filter = {
      filterOn: {
        uuid: {
          condition: "And",
          operation: "EqualTo",
          Value: this.userId
        }
      }
    };

    this.user
      .getUserCompDetail(filter)
      .then(res => {
        if (res != null) {
          this.userComList = res;
          this.isWorkSettingsLoad = true;
        }
      })
      .catch(err => {
        this.toast.create({
          message: "Something went wrong, please try again after sometime.",
          duration: 2000
        });
        this.isWorkSettingsLoad = true;
      });
  }

  saveUserComp(): void {
    let compname = this.userDetails.get("compdetail").value.txtcompname;
    let compnamestartdate = this.userDetails.get("compdetail").value
      .txtcompnamestartdate;
    let compnameenddate = this.userDetails.get("compdetail").value
      .txtcompnameenddate;

    if (typeof compname == "object" || this.user.locationsave.comp.lat == "") {
      this.toast
        .create({
          message: "Please select your company through map.",
          duration: 2000
        })
        .present();
    } else if (typeof compnamestartdate == "object") {
      this.toast
        .create({
          message: "Please select start date.",
          duration: 2000
        })
        .present();
    } else if (typeof compnameenddate == "object") {
      this.toast
        .create({
          message: "Please select end date.",
          duration: 2000
        })
        .present();
    } else {
      this.disabledBtn = true;
      this.saveworkedhidespinner = false;
      this.user.compDetail = {
        name: compname,
        status: true,
        id: null,
        isactive: true,
        locationid: null
      };
      this.api
        .post(Endpoints.api.user + "v1/work/save", this.user.compDetail)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              if (res["responseObject"]["id"] != null) {
                let compId = res["responseObject"]["id"];
                this.user.locationsave.comp.refernceid = compId;
                this.api
                  .post(
                    Endpoints.api.user + "v1/users/savelocation",
                    this.user.locationsave.comp
                  )
                  .subscribe(
                    res => {
                      if (res["responseObject"] != null) {
                        let userCompId = res["responseObject"]["id"];
                        this.user.userComp.startdate = compnamestartdate;
                        this.user.userComp.enddate = compnameenddate;
                        this.user.userComp.uuid = this.userId;
                        this.user.userComp.compid = compId;
                        this.api
                          .post(
                            Endpoints.api.user + "v1/users/savework",
                            this.user.userComp
                          )
                          .subscribe(
                            res => {
                              this.disabledBtn = false;
                              this.saveworkedhidespinner = true;
                              this.toast
                                .create({
                                  message: "Company detail saved successfully.",
                                  duration: 2000
                                })
                                .present();

                              this.userComList.push({
                                id: userCompId,
                                enddate: compnameenddate,
                                startdate: compnamestartdate,
                                uuid: this.userId,
                                isactive: true,
                                compDetail: [
                                  {
                                    name: compname,
                                    isactive: true,
                                    id: compId,
                                    status: true,
                                    location: [this.user.locationsave.comp]
                                  }
                                ]
                              });

                              this.userDetails.patchValue({
                                compdetail: { txtcompname: null }
                              });
                              this.userDetails.patchValue({
                                compdetail: { txtcompnameenddate: null }
                              });
                              this.userDetails.patchValue({
                                compdetail: { txtcompnamestartdate: null }
                              });
                            },
                            err => {
                              this.disabledBtn = true;
                              this.saveworkedhidespinner = false;
                              this.logging.message = err;
                              this.logging.methodeName = "saveUserComp detail";
                              this.call.setLoggin(this.logging);
                            }
                          );
                      } else {
                        this.toast.create({
                          message:
                            "Something went wrong, please try again after sometime",
                          duration: 2000
                        });
                      }
                    },
                    err => {
                      this.disabledBtn = true;
                      this.saveworkedhidespinner = false;
                      this.logging.message = err;
                      this.logging.methodeName = "saveUserComp location";
                      this.call.setLoggin(this.logging);
                    }
                  );
              } else {
                this.toast.create({
                  message:
                    "Something went wrong, please try again after sometime",
                  duration: 2000
                });
              }
            }
          },
          err => {
            this.disabledBtn = true;
            this.saveworkedhidespinner = false;
            this.logging.message = err;
            this.logging.methodeName = "saveUserComp";
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  saveplacelived(): void {
    let city = this.userDetails.get("placelived").value.txtplaceslivedcity;
    let state = this.userDetails.get("placelived").value.txtplaceslivedtxtstate;
    let country = this.userDetails.get("placelived").value
      .txtplaceslivedcountry;
    let strees = this.userDetails.get("placelived").value
      .txtplaceslivedtxtstreet;
    if (
      this.user.locationsave.user.lat == "" ||
      typeof city == "object" ||
      typeof state == "object" ||
      typeof country == "object" ||
      typeof strees == "object"
    ) {
      this.toast
        .create({
          message: "Please select your location through map.",
          duration: 2000
        })
        .present();
    } else {
      this.disabledBtn = true;
      this.saveplacelivedhidespinner = false;
      this.api
        .post(
          Endpoints.api.user + "v1/users/savelocation",
          this.user.locationsave.user
        )
        .subscribe(
          res => {
            this.disabledBtn = false;
            this.saveplacelivedhidespinner = true;
            if (res["responseObject"] != null) {
              this.toast
                .create({
                  message: "Location saved successfully.",
                  duration: 2000
                })
                .present();
              this.userDetails.patchValue({
                placelived: { txtplaceslivedcountry: null }
              });
              this.userDetails.patchValue({
                placelived: { txtplaceslivedtxtstate: null }
              });
              this.userDetails.patchValue({
                placelived: { txtplaceslivedcity: null }
              });
              this.userDetails.patchValue({
                placelived: { txtplaceslivedtxtstreet: null }
              });
              this.user.locationsave.user.id = res["responseObject"]["id"];
              this.userLocList.push(this.user.locationsave.user);
              this.user.locationsave.user = {
                address: null,
                city: null,
                code: null,
                country: null,
                googleplaceId: null,
                id: null,
                isactive: true,
                lat: null,
                lng: null,
                location: null,
                name: null,
                refernceid: this.userId,
                state: null,
                strees: null
              };
            } else {
              this.toast
                .create({
                  message:
                    "Something went wrong, please try again after sometime.",
                  duration: 2000
                })
                .present();
            }
          },
          err => {
            this.disabledBtn = false;
            this.saveplacelivedhidespinner = true;
            this.logging.methodeName = "saveplaceLived";
            this.logging.message = err;
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  saveAbout(): void {
    let about = this.userDetails.get("about").value.txtstatus;
    let desc = this.userDetails.get("about").value.txtabout;
    if (typeof about == "object") {
      this.toast
        .create({
          message: "Please write something about yourself in sort.",
          duration: 2000
        })
        .present();
    } else if (typeof desc == "object") {
      this.toast
        .create({
          message: "Please write something about yourself.",
          duration: 2000
        })
        .present();
    } else {
      this.disabledBtn = true;
      this.saveabouthidespinner = false;

      let updateinfo = {
        about: about,
        desc: desc,
        uid: this.userId,
        isactive: true,
        status: true
      };
      this.api
        .post(Endpoints.api.user + "v1/users/updateabout", updateinfo)
        .subscribe(
          res => {
            if (
              res["responseObject"] != null &&
              res["responseObject"] == true
            ) {
              this.toast
                .create({
                  message: "Profile updated successfully.",
                  duration: 2000
                })
                .present();
            } else {
              this.toast
                .create({
                  message:
                    "Something went wrong, please try again after sometime.",
                  duration: 2000
                })
                .present();
            }
            this.disabledBtn = false;
            this.saveabouthidespinner = true;
          },
          err => {
            this.disabledBtn = false;
            this.saveabouthidespinner = true;
          }
        );
    }
  }

  searchInChildArray(data: any, key: string): string {
    for (let i = 0; i < data.length; i++) {
      if (data[i]["types"] != null) {
        if (data[i]["types"].indexOf(key) > -1) {
          return data[i]["long_name"];
        }
      }
    }
    return null;
  }

  openUserMap(): void {
    let locationModal = this.modal.create("LocationPage");
    locationModal.onDidDismiss(data => {
      if (data != null && typeof data != "undefined") {
        let strees = this.searchInChildArray(data.addrss_compnonet, "route");
        this.user.locationsave.user = {
          address: data.address,
          location: this.searchInChildArray(data.addrss_compnonet, "locality"),
          country: this.searchInChildArray(data.addrss_compnonet, "country"),
          strees:
            strees == null
              ? this.searchInChildArray(
                  data.addrss_compnonet,
                  "sublocality_level_1"
                )
              : strees,
          code: this.searchInChildArray(data.addrss_compnonet, "postal_code"),
          city: this.searchInChildArray(
            data.addrss_compnonet,
            "administrative_area_level_2"
          ),
          lat: data.lat,
          lng: data.lng,
          id: null,
          state: this.searchInChildArray(
            data.addrss_compnonet,
            "administrative_area_level_1"
          ),
          isactive: true,
          name: "",
          refernceid: this.userId,
          googleplaceId: data.place_id
        };

        this.userDetails.patchValue({
          placelived: {
            txtplaceslivedcountry: this.user.locationsave.user.country
          }
        });
        this.userDetails.patchValue({
          placelived: {
            txtplaceslivedtxtstate: this.user.locationsave.user.state
          }
        });
        this.userDetails.patchValue({
          placelived: { txtplaceslivedcity: this.user.locationsave.user.city }
        });
        this.userDetails.patchValue({
          placelived: {
            txtplaceslivedtxtstreet: this.user.locationsave.user.strees
          }
        });
      }
    });
    locationModal.present();
  }

  saveUserInfo(): void {
    let name = this.userDetails.get("txtusername").value;
    let dob = this.userDetails.get("txtdob").value;
    let gender = this.userDetails.get("txtgender").value;
    if (typeof name == "object") {
      this.toast
        .create({
          message: "Please enter your Full Name.",
          duration: 2000
        })
        .present();
    } else if (typeof dob == "object") {
      this.toast
        .create({
          message: "Please select your Date Of Birth.",
          duration: 2000
        })
        .present();
    } else if (typeof gender == "object") {
      this.toast
        .create({
          message: "Please select your gender.",
          duration: 2000
        })
        .present();
    } else {
      this.disabledBtn = true;
      this.saveinfohidespinner = false;

      let fname = "";
      let lname = "";
      if (name.split(" ").length > 0) {
        fname = name.split(" ")[0];
        lname = name.split(" ")[1];
      }
      this.api
        .post(Endpoints.api.user + "v1/users/update", {
          name: name,
          lname: lname,
          fname: fname,
          dob: dob,
          gender: gender,
          uid: this.userId,
          primarynumber: this.mobilenumber,
          primarynumbercode: this.countrycode,
          isactive: this.isactive,
          status: true
        })
        .subscribe(
          res => {
            this.toast
              .create({
                message: "Details updated successfully.",
                duration: 2000
              })
              .present();
            this.saveinfohidespinner = true;
            this.disabledBtn = false;
          },
          err => {
            this.toast
              .create({
                message: "Something went wrong, please try after sometime.",
                duration: 2000
              })
              .present();
            this.disabledBtn = false;
            this.saveinfohidespinner = true;
            this.logging.methodeName = "saveUserInfo";
            this.logging.message = err;
            this.call.setLoggin(this.logging);
          }
        );
    }
  }

  getUserLocation(): void {
    let filter = {
      filterOn: {
        refernceid: {
          condition: "And",
          operation: "EqualTo",
          Value: this.userId
        }
      }
    };
    this.user
      .getUserLivedLocations(filter)
      .then(res => {
        this.userLocList = res;
        this.isPlaceSettingsLoad = true;
      })
      .catch(err => {
        this.isPlaceSettingsLoad = true;
        this.toast.create({
          message: "Something went wrong, please try again after sometime.",
          duration: 2000
        });
      });
  }

  setAboutInfo(about: string, desc: string): void {
    this.userDetails.patchValue({ about: { txtstatus: about } });
    this.userDetails.patchValue({ about: { txtabout: desc } });
  }

  deleteLocation(id: string): void {
    this.api
      .post(Endpoints.api.user + "v1/users/locationdelete", {
        uid: id
      })
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.call.filterByKey("id", id, this.userLocList, "delete");
            this.toast
              .create({
                message: "Location deleted successfully.",
                duration: 2000
              })
              .present();
          }
        },
        err => {
          this.logging.message = err;
          this.logging.methodeName = "deleteLocation";
          this.call.setLoggin(this.logging);
          this.toast
            .create({
              message: "Something went wrong, please try again after sometime.",
              duration: 2000
            })
            .present();
        }
      );
  }

  deleteWorkLocation(id: string): void {
    this.api
      .post(Endpoints.api.user + "v1/users/workdelete", {
        uid: id
      })
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.call.filterByKey("id", id, this.userLocList, "delete");
            this.toast
              .create({
                message: "Work Location deleted successfully.",
                duration: 2000
              })
              .present();
          }
        },
        err => {
          this.logging.message = err;
          this.logging.methodeName = "deleteWorkLocattion";
          this.call.setLoggin(this.logging);
          this.toast
            .create({
              message: "Something went wrong, please try again after sometime.",
              duration: 2000
            })
            .present();
        }
      );
  }

  ionViewDidLoad() {
    this.user.getLoggedUser().then(res => {
      if (res != null) {
        if (res.length > 0) {
          let dobdate = this.call.getDate(res[0].dob);
          this.call.setValueKey("userdetails", res[0]);
          this.userDetails.patchValue({
            txtusername: res[0].name,
            txtdob: dobdate,
            txtgender: res[0].gender
          });
          this.setAboutInfo(res[0].about, res[0].desc);
          this.isAboutSettingsLoad = true;
          this.isProfileSettingsLoad = true;
        }
      }
      this.userId = this.userId == null ? res[0].uId : this.userId;
      this.getUserComp();
      this.getUserLocation();
    });
  }
}

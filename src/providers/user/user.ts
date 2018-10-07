import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { CallProvider } from "../call/call";
import { Api } from "../api/api";
import { Endpoints } from "../../config/Endpoints";
import { Observable } from "rxjs";
import { Logging } from "../../models/logging";
import { Headers } from "@angular/http";

@Injectable()
export class UserProvider {
  private logging: Logging;

  userCompDetais: any[] = [];
  userLivedPlace: any[] = [];
  locationDetail = {
    id: "",
    strees: "",
    country: "",
    location: "",
    name: "",
    lat: "",
    lng: "",
    city: "",
    code: "",
    state: "",
    address: "",
    refernceid: "",
    googleplaceId: "",
    isactive: true
  };
  locationsave = { user: this.locationDetail, comp: this.locationDetail };
  userComp = {
    id: "",
    startdate: "",
    enddate: "",
    compid: "",
    uuid: "",
    isactive: true
  };
  compDetail = {
    id: "",
    name: "",
    status: true,
    isactive: true,
    locationid: ""
  };
  listuserComp = {
    id: "",
    enddate: "",
    startdate: "",
    uuid: "",
    isactive: "",
    compDetail: []
  };
  compName = {
    name: "",
    isactive: "",
    id: "",
    status: "",
    location: []
  };
  constructor(private call: CallProvider, private api: Api) {
    this.logging = new Logging();
    this.logging.className = "UserProvider";
  }

  getUser(filter: any): Observable<any> {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Access-Control-Allow-Origin" , "*");
    return this.api.post(Endpoints.api.user + "v1/userinfo/get", filter, headers);
  }

  getUserOnColumns(filter: any): Observable<ArrayBuffer> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin" , "*");
    return this.api.post(Endpoints.api.user + "v1/userinfo/getsearch", filter, headers);
  }

  getUserCompDetail(filter: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .post(Endpoints.api.user + "v1/userinfo/getwork", filter)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              let list = res["responseObject"];
              let listCount = list.length;

              for (let i = 0; i < listCount; i++) {
                this.listuserComp.id = list[i].id;
                this.listuserComp.enddate = this.call.getDate(list[i].endDate);
                this.listuserComp.startdate = this.call.getDate(
                  list[i].startDate
                );
                this.listuserComp.uuid = list[i].uuid;
                this.listuserComp.isactive = list[i].isActive;
                let compList = list[i].compDetail;
                if (compList != null) {
                  for (let j = 0; j < compList.length; j++) {
                    this.compName.name = compList[j]["name"];
                    this.compName.isactive = compList[j]["isActive"];
                    this.compName.id = compList[j]["id"];
                    this.compName.status = compList[j]["status"];
                    let loc = compList[j]["location"];
                    if (loc != null) {
                      for (let k = 0; k < loc.length; k++) {
                        this.compName.location.push({
                          city: loc[k].city,
                          code: loc[k].code,
                          address: loc[k].address,
                          country: loc[k].country,
                          state: loc[k].state,
                          strees: loc[k].strees,
                          id: loc[k].id,
                          lat: loc[k].lat,
                          lng: loc[k].lng,
                          isactive: loc[k].isActive,
                          location: loc[k].location,
                          refernceid: loc[k].refernceid
                        });
                      }
                    }
                    this.listuserComp.compDetail.push(this.compName);
                  }
                }
                this.userCompDetais.push(this.listuserComp);
                this.flushPerviousData();
              }
            }
            resolve(this.userCompDetais);
          },
          err => {
            resolve([]);
          }
        );
    });
  }

  flushPerviousData(): void {
    this.listuserComp = {
      id: "",
      enddate: "",
      startdate: "",
      uuid: "",
      isactive: "",
      compDetail: []
    };
    this.compName = {
      id: "",
      isactive: "",
      name: "",
      status: "",
      location: []
    };
  }

  getUserLivedLocations(filter: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.call
        .getValueByKey("userinfo")
        .then(res => {
          this.api
            .post(Endpoints.api.user + "v1/userinfo/getlocations", filter)
            .subscribe(
              res => {
                if (res["responseObject"] != null) {
                  let list = res["responseObject"];
                  for (let i = 0; i < list.length; i++) {
                    this.locationsave.user = {
                      address: list[i].address,
                      city: list[i].city,
                      code: list[i].code,
                      country: list[i].country,
                      id: list[i].id,
                      googleplaceId: list[i].googleplaceId,
                      lat: list[i].lat,
                      isactive: list[i].isActive,
                      lng: list[i].lat,
                      location: list[i].location,
                      name: "",
                      refernceid: list[i].refernceid,
                      state: list[i].state,
                      strees: list[i].strees
                    };
                    this.userLivedPlace.push(this.locationsave.user);
                  }
                  resolve(this.userLivedPlace);
                }
                resolve([]);
              },
              err => {
                resolve([]);
                this.logging.message = err;
                this.logging.methodeName = "getUserLivedLocations";
                this.call.setLoggin(this.logging);
              }
            );
        })
        .catch(e => {
          resolve([]);
        });
    });
  }

  getLoggedUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.call.getValueByKey("userinfo").then(res => {
        if (res != null) {
          let filter = {
            filterOn: {
              uid: {
                condition: "And",
                operation: "EqualTo",
                Value: res.userId
              }
            }
          };

          this.getUser(filter).subscribe(
            res => {
              if (res["responseObject"] != null) {
                resolve(res["responseObject"]);
              }
            },
            err => {
              resolve([]);
              this.logging.methodeName = "getLoggedUser";
              this.logging.message = err;
              this.call.setLoggin(this.logging);
            }
          );
        } else {
          resolve([]);
        }
      });
    });
  }

  updateUserSettings(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .post(Endpoints.api.appsettings + "v1/appusersettings/update", data)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              resolve(res["responseObject"]);
            }
            resolve([]);
          },
          err => {
            resolve([]);
            this.logging.message = err;
            this.logging.methodeName = "updateUserSettings";
            this.call.setLoggin(this.logging);
          }
        );
    });
  }

  insertUserSettings(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .post(Endpoints.api.appsettings + "v1/appusersettings/save", data)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              resolve(res["responseObject"]);
            }
            resolve([]);
          },
          err => {
            resolve([]);
            this.logging.message = err;
            this.logging.methodeName = "insertUserSettings";
            this.call.setLoggin(this.logging);
          }
        );
    });
  }

  getUserSettings(fiter: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .post(Endpoints.api.appsettings + "v1/appusersettings/get", fiter)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              resolve(res["responseObject"]);
            }
            resolve([]);
          },
          err => {
            resolve([]);
            this.logging.message = err;
            this.logging.methodeName = "getUserSettings";
            this.call.setLoggin(this.logging);
          }
        );
    });
  }
}

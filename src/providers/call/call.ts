import { Injectable, ElementRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Api } from "../api/api";
import { Logging } from "../../models/logging";
import { Endpoints } from "../../config/Endpoints";
import { Headers } from "@angular/http";

@Injectable()
export class CallProvider {
  timCounter: any;
  globalStream: any;
  toCallElementRef: any;
  constructor(private storage: Storage, private api: Api) {}

  clearStorage(): Promise<any> {
    return this.storage.clear();
  }

  removeKey(keyName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.remove(keyName).then(res => {
        resolve(res);
      });
    });
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

  getValueByKey(keyName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage
        .get(keyName)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  timeSince(date: number): any {
    let currentDate = new Date().getTime();
    let seconds = Math.floor((currentDate - date) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " m";
    }
    return Math.floor(seconds) + " s";
  }

  setValueKey(keyName: string, keyValue: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set(keyName, keyValue).then(res => {
        resolve(res);
      });
    });
  }

  appendKeyValue(keyName: string, keyValue: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let records: Array<{}> = [];
      this.getValueByKey(keyName)
        .then(res => {
          if (res != null) {
            for (let item in res) {
              records.push(res[item]);
            }
            records.push(keyValue);
            this.setValueKey(keyName, records);
            resolve(true);
          } else {
            records.push(keyValue);
            this.setValueKey(keyName, records).then(res => {
              resolve(true);
            });
          }
        })
        .catch(err => {
          resolve(false);
        });
    });
  }

  appendValue(key: Array<{}>, items: any): Promise<any> {
    return new Promise((resolve, reject) => {
      for (let item in items) {
        key.push(item);
      }
      resolve(key);
    });
  }

  setLoggin(logging: Logging): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");

      this.api
        .post(Endpoints.api.appsettings + "v1/logging/set", headers)
        .subscribe(
          res => {
            resolve(res);
          },
          err => {
            console.log(err);
          }
        );
    });
  }

  timedownCounter(hh: number, mm: number, ss: number): void {
    let _timeCountdown = setInterval(() => {
      if (hh != 0 && mm == 0) {
        hh -= 1;
      }

      if (mm > 59) {
        mm = 59;
      }

      if (mm != 0 && ss == 0) {
        mm -= 1;
      } else if (hh >= 0 && mm == 0 && ss == 0) {
        mm = 59;
      }

      if (ss != 0 && mm >= 0) {
        ss -= 1;
      } else if (ss == 0) {
        ss = 59;
      } else {
        ss = 0;
      }
      if (hh == 0 && mm == 0 && ss == 0) {
        clearInterval(_timeCountdown);
      }
      this.timCounter = hh + ":" + mm + ":" + ss;
    }, 1000);
  }

  getDate(date: string): any {
    if (date != null) {
      let _date = new Date(parseInt(date.replace(/\//g, "").substr(5)));
      let year = _date.getFullYear();
      let month =
        _date.getMonth() < 9
          ? "0" + (parseInt(_date.getMonth().toString()) + parseInt("1"))
          : _date.getMonth() + 1;
      let day = _date.getDate() <= 9 ? "0" + _date.getDate() : _date.getDate();
      console.log(year + "-" + month + "-" + day);
      return year + "-" + month + "-" + day;
    }
    return date;
  }

  filterByKey(
    key: string,
    value: string,
    data: any[],
    action: any = "select"
  ): any {
    return data.filter(function(item, index) {
      if (action == "delete") {
        if (item[key] == value) {
          data.splice(index);
          return true;
        }
        return false;
      } else {
        return item[key] == value;
      }
    });
  }

  convertToDataURLviaCanvas(url, outputFormat): Promise<any> {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        let canvas = <HTMLCanvasElement>document.createElement("CANVAS"),
          ctx = canvas.getContext("2d"),
          dataURL;
        canvas.height = img.height + 10;
        canvas.width = img.width + 10;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        //callback(dataURL);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }
}

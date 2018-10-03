import { Injectable } from "@angular/core";
import { CallProvider } from "../call/call";
import { Logging } from "../../models/logging";
import { Observable } from "rxjs";
import { Api } from "../api/api";
import { Endpoints } from "../../config/Endpoints";

@Injectable()
export class CallchatmessageProvider {
  logging: Logging;
  constructor(private call: CallProvider, private api: Api) {
    this.logging = new Logging();
    this.logging.className = "CallChatMessageProvider";
  }

  getCallChatList(filter: any): Observable<any> {
    return this.api.post(Endpoints.api.chat + "v1/chat/getsettings", filter);
  }

  saveCallChat(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api.post(Endpoints.api.chat + "v1/chat/start", data).subscribe(
        res => {
          if (res["responseObject"] != null) {
            resolve(res["responseObject"]);
          }
          resolve([]);
        },
        err => {
          resolve([]);
          this.logging.message = err;
          this.logging.methodeName = "saveCallChat";
          this.call.setLoggin(this.logging);
        }
      );
    });
  }

  updateCallChat(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.api
        .post(Endpoints.api.chat + "v1/chat/updatesettings", data)
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
            this.logging.methodeName = "saveCallChat";
            this.call.setLoggin(this.logging);
          }
        );
    });
  }
}

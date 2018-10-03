import { Injectable, OnInit } from "@angular/core";
import { Logging } from "../../models/logging";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Endpoints } from "../../config/Endpoints";
import { Api } from "../api/api";
import { APIKeys } from "../../config/APIKeys";
import { Platform } from "ionic-angular";
import { CallProvider } from "../call/call";

@Injectable()
export class InitloadProvider implements OnInit {
  logging: Logging;
  ngOnInit(): void {}
  constructor(
    private fauth: AngularFireAuth,
    private httpClient: HttpClient,
    private call: CallProvider,
    private api: Api,
    private platform: Platform
  ) {
    this.logging = new Logging();
  }

  appendScripts(): void {
    let scripts = [
      {
        src: "https://cdn.webrtc.ecl.ntt.com/skyway-latest.js",
        id: "skyway-latest"
      }
    ];
    let headTag = document.getElementsByTagName("head");
    for (let i = 0; i < scripts.length; i++) {
      let scriptTag: HTMLScriptElement = document.createElement("script");

      scriptTag.src = scripts[i].src;
      scriptTag.id = scripts[i].id;
      scriptTag.type = "text/javascript";
      headTag[0].appendChild(scriptTag);
    }
  }

  isPlatform(platformName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (platformName.toLowerCase() == "android") {
        resolve(true);
      } else if (platformName.toLowerCase() == "ios") {
        resolve(true);
      } else if (platformName.toLowerCase() == "browser") {
        resolve(true);
      }
    });
  }

  setDeviceId(): void {
    this.call.getValueByKey("userinfo").then(res => {
      if (res == null || typeof res == null || typeof res == "object") {
        this.loginToFirebase(res.userId);
      } else {
        this.loginToFirebase(res.userId);
      }
    });
  }

  verifyToken(): void {}

  loginToFirebase(userId: string) {
    this.logging.methodeName = "loginToFirebase";
    const httpOptions = {
      headers: new HttpHeaders({
        "auth-token": "gen-token-fromserver"
      })
    };
    if (this.fauth.auth.currentUser == null) {
      this.httpClient
        .post(
          Endpoints.firebase.functions + "generateToken",
          {
            userId: userId
          },
          httpOptions
        )
        .subscribe(
          data => {
            if (userId.length > 20) {
              this.fauth.auth
                .signInWithCustomToken(data["token"])
                .then(userData => {
                  console.log(userData);
                })
                .catch(err => {
                  this.logging.message = err.message + err.name + err.stack;
                  this.logging.extrainformation = "Firebase token access";
                  this.api.post(
                    Endpoints.api.appsettings + "api/v1/logging/setlogging",
                    this.logging
                  );
                });
            } else {
              this.logging.message = "userId less than 20";
              this.api.post(
                Endpoints.api.appsettings + "api/v1/logging/setlogging",
                this.logging
              );
            }
          },
          err => {
            this.logging.message = err;
            this.logging.extrainformation = "POST request sent error";
            this.api.post(
              Endpoints.api.appsettings + "api/v1/logging/setlogging",
              this.logging
            );
          }
        );
    }
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Api } from "../api/api";
import { Endpoints } from "../../config/Endpoints";
import { Events } from "ionic-angular";

@Injectable()
export class PostProvider {
  constructor(private api: Api, private events: Events) {
    console.log("Hello PostProvider Provider");
  }

  savePost(saveData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let header = new Headers();
      header.append("content-type", "application/json");
      this.api
        .put(Endpoints.api.news + "v1/post/create", saveData, header)
        .subscribe(
          res => {
            if (res["responseObject"] != null) {
              this.events.publish("post:request", {
                msg: "Post created successfully.",
                id: res["responseObject"]["id"]
              });
            }
            resolve(true);
          },
          err => {
            this.events.publish("post:request", {
              err: "Something went wrong, please try again after sometime."
            });
            resolve(true);
          }
        );
    });
  }
}

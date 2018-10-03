import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

/*
  Generated class for the SmileyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SmileyProvider {
  constructor(public http: HttpClient) {
    console.log("Hello SmileyProvider Provider");
  }

  smileyLoad(): Promise<any> {
    return new Promise((resolve, reject) => {
      let _smiley;
      _smiley = this.http.get("assets/json/emojis.json").subscribe((data) => {
        resolve(data);
      });
    });
  }
}

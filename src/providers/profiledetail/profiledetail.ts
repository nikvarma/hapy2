import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ProfiledetailProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ProfiledetailProvider Provider');
  }

}

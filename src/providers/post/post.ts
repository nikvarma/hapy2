import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PostProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PostProvider Provider');
  }

}

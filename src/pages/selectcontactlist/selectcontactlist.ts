import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { Item } from "../../models/item";
import { Items } from "../../providers";

@IonicPage()
@Component({
  selector: "page-selectcontactlist",
  templateUrl: "selectcontactlist.html"
})
export class SelectcontactlistPage {
  tagList: Array<any> = [];
  currentItems: Item[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    private viewCtrl: ViewController
  ) {
    this.currentItems = this.items.query();
  }

  addToTagList(event: any, taggedItem: any): void {
    console.log(event.checked);
    if (event.checked) {
      this.tagList.push(taggedItem);
    } else {
      let index = this.getArrayIndex(this.tagList, "name", taggedItem.name);
      this.tagList.splice(index, 1);
    }
    console.log(this.tagList);
  }

  getArrayIndex(item: any, key: any, value: any): any {
    for (let index = 0; index < item.length; index++) {
      if (item[index][key] == value) {
        return index;
      }
    }
  }

  ionViewDidLoad() {}

  contactList(): void {
    this.viewCtrl.dismiss({
      cItem: this.tagList
    });
  }

  getItems(): void {}
}

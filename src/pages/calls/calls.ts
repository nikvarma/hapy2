import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Item } from "../../models/item";
import { Items } from "../../providers";

/**
 * Generated class for the CallsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-calls",
  templateUrl: "calls.html"
})
export class CallsPage implements OnInit {
  currentItems: Item[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public modalCtrl: ModalController
  ) {
    this.currentItems = this.items.query();
  }

  addItem() {
    let addModal = this.modalCtrl.create("ItemCreatePage");
    addModal.onDidDismiss(item => {
      if (item) {
        this.items.add(item);
      }
    });
    addModal.present();
  }
  deleteItem(item) {
    this.items.delete(item);
  }
  openItem(item: Item) {
    this.navCtrl.push("ItemDetailPage", {
      item: item
    });
  }

  openCallBox(): void {
    this.modalCtrl.create("CallBoxPage").present();
  }

  ngOnInit(): void {}
}

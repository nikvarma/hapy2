import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  Events,
  ToastController
} from "ionic-angular";
import { Item } from "../../models/item";
import { Items, CallProvider } from "../../providers";

@IonicPage()
@Component({
  selector: "page-calls",
  templateUrl: "calls.html"
})
export class CallsPage implements OnInit {
  callList: any = [];
  currentItems: Item[];
  constructor(
    public items: Items,
    private event: Events,
    private call: CallProvider,
    public navParams: NavParams,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
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

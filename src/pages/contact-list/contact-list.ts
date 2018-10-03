import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController
} from "ionic-angular";
import { Items } from "../../providers";
import { Item } from "../../models/item";

@IonicPage()
@Component({
  selector: "page-contact-list",
  templateUrl: "contact-list.html"
})
export class ContactListPage implements OnInit {
  currentItems: Item[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public modalCtrl: ModalController,
    private viewCtrl: ViewController
  ) {
    this.currentItems = this.items.query();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ContactListPage");
  }

  openItem(item: Item) {
    this.navCtrl.push("ItemDetailPage", {
      item: item
    });
  }

  contactList(): void {
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    console.log("Okk");
  }
}

import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ToastController
} from "ionic-angular";
import { Items, CallProvider } from "../../providers";
import { Item } from "../../models/item";
import { CallchatmessageProvider } from "../../providers/callchatmessage/callchatmessage";
import { Logging } from "../../models/logging";
import { Operation } from "../../enums/operations";

@IonicPage()
@Component({
  selector: "page-message",
  templateUrl: "message.html",
  providers: [CallchatmessageProvider]
})
export class MessagePage implements OnInit {
  currentItems: Item[];
  userId: any;
  private chatList: any = [];
  logging: Logging;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    public modalCtrl: ModalController,
    private call: CallProvider,
    private toastCtrl: ToastController,
    private callchatMessage: CallchatmessageProvider
  ) {
    this.logging = new Logging();
    this.logging.className = "MessagePage";
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

  openChatBox(): void {
    this.modalCtrl.create("ChatBoxPage").present();
  }

  getCallChat(): void {
    let filter = {
      filterOn: {
        cfromId: {
          operation: Operation.EqualTo,
          condition: "Or",
          value: this.userId
        },
        ctoId: {
          operation: Operation.EqualTo,
          condition: "Or",
          value: this.userId
        }
      }
    };
    console.log(this.userId);
    this.callchatMessage.getCallChatList(filter).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.logging.message = err;
        this.logging.methodeName = "getCallChat";
        this.call.setLoggin(this.logging);
      }
    );
  }

  ngOnInit(): void {
    this.call.getValueByKey("userinfo").then(res => {
      this.userId = res.userId;
      this.getCallChat();
    });
  }
}

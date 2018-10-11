import {
  Component,
  OnInit,
  AfterContentInit,
  ElementRef,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  ActionSheetController,
  PopoverController,
  ToastController,
  Content,
  ModalController
} from "ionic-angular";

import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { InitloadProvider, CallProvider, Api } from "../../providers";
import { CallchatmessageProvider } from "../../providers/callchatmessage/callchatmessage";
import { MessageBox, MessageSendBy } from "../../models/index";
import { Endpoints } from "../../config/Endpoints";
import { Logging } from "../../models/logging";

@IonicPage()
@Component({
  selector: "page-chat-box",
  templateUrl: "chat-box.html",
  providers: [CallProvider, CallchatmessageProvider]
})
export class ChatBoxPage implements OnInit, AfterContentInit, AfterViewInit {
  toId: string;
  userId: string;
  bgImage: string;
  messageId: string;
  toUserDetails = {};
  items: Observable<any[]>;
  textempty: boolean = true;
  messageList: Array<any> = [];
  messageTextBox: HTMLTextAreaElement;
  isLoad: boolean = true;
  logging: Logging;
  isScrollDown = false;
  @ViewChild("messageTextarea", { read: ElementRef })
  ionTextarea: ElementRef;
  @ViewChild(Content)
  ionContent: Content;
  @ViewChild("chatboxbody", { read: ElementRef })
  chatboxbody: ElementRef;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private viewCtrl: ViewController,
    private actionsheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private fdb: AngularFireDatabase,
    private initLoad: InitloadProvider,
    private call: CallProvider,
    private toast: ToastController,
    private modalCtrl: ModalController,
    private api: Api,
    private callchatMessage: CallchatmessageProvider
  ) {
    this.logging = new Logging();
    this.logging.className = "ChatBoxPage";
  }

  ionViewDidLoad() {}

  closeChatBox(): void {
    this.isScrollDown = true;
    this.viewCtrl.dismiss();
  }

  shareThings(): void {
    this.actionsheetCtrl
      .create({
        cssClass: "action-sheet chatbox-share-things",
        buttons: [
          {
            icon: "pin",
            text: "Location",
            cssClass: "location-icon-color",
            handler: () => {
              let locPosition = this.modalCtrl.create("LocationPage");
              locPosition.present();
              locPosition.onDidDismiss(res => {
                let locAddress = res["address"];
                let params = {
                  center: res.lat + "," + res.lng,
                  zoom: 14,
                  imageformat: "png",
                  size: "400x400"
                };

                this.api
                  .post(Endpoints.api.location + "v1/location/image", params)
                  .subscribe(
                    res => {
                      if (res["ResponseObject"] != null) {
                        let sendby: MessageSendBy = {
                          id: this.userId
                        };
                        let saveData: MessageBox = {
                          status: 1,
                          id: this.toId,
                          name: "Avatar",
                          sendby: sendby,
                          sdate: new Date().getTime(),
                          dtime: new Date().getTime(),
                          rtime: new Date().getTime(),
                          ismediacontent: false,
                          mediatype: "png",
                          mediacontent:
                            Endpoints.locationimage +
                            "locationimages/" +
                            res["ResponseObject"]["Id"] +
                            ".png",
                          message: locAddress,
                          profileimage:
                            "assets/img/avatar-profile-picture-default-i.jpg"
                        };

                        // this.messageList.push(saveData);
                        this.fbCall(saveData);
                      }
                      console.log(res);
                    },
                    err => {
                      this.logging.message = err;
                      this.logging.methodeName =
                        "Chat Location - getStaticImage";
                      this.call.setLoggin(this.logging);
                    }
                  );
              });
            }
          },
          {
            icon: "images",
            text: "Image",
            cssClass: "call-icon-color",
            handler: () => {}
          },
          {
            icon: "film",
            text: "Video",
            cssClass: "video-icon-color",
            handler: () => {}
          },
          {
            icon: "document",
            text: "Document",
            cssClass: "document-icon-color",
            handler: () => {}
          }
        ]
      })
      .present();
  }

  sendMessage(): void {
    if (this.messageId == null) {
      this.getMessageId(true).then(res => {
        if (res != null) {
          console.log(res);
          this.addToFb();
        }
      });
    }
    if (this.messageId != null) {
      this.addToFb();
    }
  }

  addToFb(): void {
    let sendBy: MessageSendBy = {
      id: this.userId
    };
    let saveData: MessageBox = {
      status: 1,
      id: this.toId,
      name: "Avatar",
      sendby: sendBy,
      sdate: new Date().getTime(),
      dtime: new Date().getTime(),
      rtime: new Date().getTime(),
      ismediacontent: false,
      message: this.messageTextBox,
      profileimage: "assets/img/avatar-profile-picture-default-i.jpg"
    };

    // this.messageList.push(saveData);
    this.fbCall(saveData);
    console.log(this.ionTextarea);
    this.ionTextarea.nativeElement.children[0].removeAttribute("style");
    this.messageTextBox = null;
    this.textempty = true;
    this.ionTextarea.nativeElement.children[0].focus();
  }

  fbCall(saveData: any): void {
    saveData.fbstatus = 0;
    console.log(this.messageId);
    this.messageList.push(saveData);
    this.call.appendKeyValue(this.messageId, saveData);
    // this.fdb.database
    //   .ref("messages")
    //   .child(this.messageId)
    //   .push(saveData)
    //   .then(res => {})
    //   .catch(err => {
    //     this.initLoad.loginToFirebase(this.userId);
    //   });
  }

  getMessageId(issave: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      let saveData = {
        fromId: this.userId,
        toId: this.toId,
        isactive: true,
        status: true,
        issave: issave
      };
      this.callchatMessage
        .saveCallChat(saveData)
        .then(res => {
          if (res["id"] != null) {
            this.messageId = res["id"];
            this.messageListener(this.messageId);
            resolve(this.messageId);
          } else {
            resolve(null);
          }
        })
        .catch(err => {
          resolve(null);
          this.toast
            .create({
              message: "Something went wrong, please try again after sometime.",
              duration: 2000
            })
            .present();
        });
    });
  }

  sinceTime(date: number): any {
    return this.call.timeSince(date);
  }

  ngOnInit(): void {
    this.toId = this.navParams.get("uItem").tuid;
    this.messageId = this.navParams.get("uItem").msgId
      ? this.navParams.get("uItem").msgId
      : null;
    this.call.getValueByKey("userinfo").then(res => {
      this.userId = res.userId;
      this.getMessageId(false);
    });
    this.messageList = [];
  }

  messageListener(id: string) {
    let jsonData = null;
    this.fdb.database
      .ref("messages")
      .child(id)
      .on("child_added", res => {
        jsonData = res.toJSON();
        if (jsonData != null) {
          if (jsonData.message != null) {
            jsonData.message = jsonData.message.trim().replace(/\n/g, "<br />");
          }
          if (jsonData.sdate != null) {
            //jsonData.sdate = this.call.timeSince(jsonData.sdate);
          }
          this.messageList.push(jsonData);
          if (!this.isScrollDown) {
            this.scrollToList();
          }
        }
      });
  }

  userProfile(): void {}

  protected adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = "hidden";
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    let hgth = textarea.style.height.replace(/px/g, "");
    if (parseInt(hgth) > 76) {
      textarea.style.height = "76px";
      textarea.style.overflow = "auto";
    }
    if (parseInt(hgth) == 46) {
      textarea.style.height = "32px";
    }

    if (textarea.value.length > 1) {
      this.textempty = false;
    } else {
      this.textempty = true;
    }
    return;
  }

  onHold(): void {
    console.log("okk");
  }

  setBgImage(): void {
    this.bgImage = "assets/img/speakers/bg.svg";

    this.chatboxbody.nativeElement.style.backgroundImage =
      "url(" + this.bgImage + ")";
    this.chatboxbody.nativeElement.style.backgroundRepeat = "no-repeat";
    this.chatboxbody.nativeElement.style.backgroundSize = "cover";

    this.chatboxbody.nativeElement.style.backgroundAttachment = "fixed";
  }

  opPageScroll(): void {}

  ngAfterViewInit(): void {
    this.ionContent.ionScrollEnd.subscribe(res => {
      if (res != null) {
        let scrollDim = this.ionContent.getContentDimensions();
        let scrollH = scrollDim.scrollHeight;
        let scrollContentH = scrollDim.contentHeight;
        let scrolledH = scrollDim.scrollTop;
        if (scrollContentH + scrolledH > scrollH - 20) {
          this.isScrollDown = false;
        } else {
          this.isScrollDown = true;
        }
      }
    });
  }

  ngAfterContentInit(): void {
    setInterval(() => {
      if (!this.isScrollDown) {
        this.scrollToList();
      }
    }, 1500);
    this.scrollToList();
  }

  scrollToList(): void {
    let scrollHeight = this.ionContent.getContentDimensions().scrollHeight + 30;
    this.ionContent.scrollTo(0, scrollHeight, 300);
  }
}

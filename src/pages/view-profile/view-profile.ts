import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  PopoverController,
  ModalController,
  ModalOptions,
  ToastController
} from "ionic-angular";
import { PopoverComponent } from "../../components/popover/popover";
import { CallProvider, UserProvider, Api } from "../../providers";
import { Endpoints } from "../../config/Endpoints";
import { Logging } from "../../models/logging";

@IonicPage()
@Component({
  selector: "page-view-profile",
  templateUrl: "view-profile.html",
  providers: [CallProvider, UserProvider]
})
export class ViewProfilePage implements OnInit {
  profileuserinfocontrols: any;
  userDetail: any;
  userId: string = "";
  loggedUserDetail: any;
  logging: Logging;
  userInfo: {} = {};
  postList: any = [];
  videoList: any = [];
  imageList: any = [];
  friendList: any = [];
  userLocList: any = [];
  userCompList: any = [];
  isPlaceSettingsLoad: boolean = false;
  isWorkSettingsLoad: boolean = false;
  isUserInfoSettingsLoad: boolean = false;
  sendFriendRequestSpinner: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private call: CallProvider,
    private user: UserProvider,
    private api: Api,
    private toast: ToastController
  ) {
    this.call.getValueByKey("userinfo").then(res => {
      this.userId = res.userId;
    });
    this.call.getValueByKey("userdetails").then(res => {
      this.loggedUserDetail = res;
      console.log(this.loggedUserDetail);
    });
    this.logging = new Logging();
    this.logging.className = "ViewProfilePage";
  }

  callback: any;

  ionViewDidLoad() {
    this.profileuserinfocontrols = "Post";
  }

  accpetFriend(): void {
    let updateData = this.userDetail.user.friend;
    updateData.isrequestaccpted = true;
    updateData.isblocked = false;
    this.sendFriendRequestSpinner = true;
    this.api
      .post(Endpoints.api.user + "v1/userrequest/update", updateData)
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.sendFriendRequestSpinner = false;
          } else {
            this.toast
              .create({
                message:
                  "Unable to send request, please try again after sometime.",
                duration: 2000
              })
              .present();
          }
        },
        err => {
          this.sendFriendRequestSpinner = false;
          this.toast
            .create({
              message:
                "Unable to send request, please try again after sometime.",
              duration: 2000
            })
            .present();
        }
      );
  }

  addFriend(event: Event): void {
    event.stopPropagation();
    let saveData = {
      fromId: this.userId,
      toId: this.userDetail.user.uid,
      requestmessage: "I would like to be your friend.",
      isrequestaccpted: false,
      isblocked: false,
      status: true
    };
    this.sendFriendRequestSpinner = true;
    this.api
      .post(Endpoints.api.user + "v1/userrequest/add", saveData)
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.userDetail.user.friend = {
              fid: saveData.fromId,
              tid: saveData.toId,
              isaccpted: saveData.isrequestaccpted,
              isblocked: saveData.isblocked,
              id: res["responseObject"]["id"]
            };
          } else {
            this.toast
              .create({
                message:
                  "Unable to send request, please try again after sometime.",
                duration: 2000
              })
              .present();
          }
          this.sendFriendRequestSpinner = false;
        },
        err => {
          this.toast
            .create({
              message:
                "Unable to send request, please try again after sometime.",
              duration: 2000
            })
            .present();
          this.sendFriendRequestSpinner = false;
          this.logging.message = err;
          this.logging.methodeName = "AddFriend";
          this.call.setLoggin(this.logging);
        }
      );
  }

  unFriend(event: Event): void {
    event.stopPropagation();

    this.sendFriendRequestSpinner = true;
    this.api
      .post(
        Endpoints.api.user + "v1/userrequest/remove",
        this.userDetail.user.friend
      )
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.userDetail.user.friend = null;
            this.sendFriendRequestSpinner = false;
          } else {
            this.toast
              .create({
                message:
                  "Unable to send request, please try again after sometime.",
                duration: 2000
              })
              .present();
          }
        },
        err => {
          this.sendFriendRequestSpinner = false;
          this.toast
            .create({
              message:
                "Unable to send request, please try again after sometime.",
              duration: 2000
            })
            .present();
          this.logging.message = err;
          this.logging.methodeName = "UnFriend";
          this.call.setLoggin(this.logging);
        }
      );
  }

  ngOnInit(): void {
    let uitem = this.navParams.get("uItem");
    this.userDetail = uitem;

    console.log(this.userDetail);
  }

  loadContent(): void {
    switch (this.profileuserinfocontrols) {
      case "Info":
        this.getUserInfo();
        this.getUserLocation();
        this.getUserWrok();
        break;

      default:
        break;
    }
  }

  moreOption(popevent): void {
    let popover = this.popoverCtrl.create(PopoverComponent, {});
    popover.present({
      ev: popevent
    });
  }

  getUserWrok(): void {
    let filter = {
      filterOn: {
        uuid: {
          operation: "EqualTo",
          Value: this.userDetail.user.uid
        }
      }
    };

    this.user
      .getUserCompDetail(filter)
      .then(res => {
        if (res != null) {
          this.userCompList = res;
          this.isWorkSettingsLoad = true;
        }
      })
      .catch(err => {
        this.toast.create({
          message: "Something went wrong, please try again after sometime.",
          duration: 2000
        });
        this.isWorkSettingsLoad = true;
      });
  }

  getUserLocation(): void {
    this.isPlaceSettingsLoad = true;
    let filter = {
      filterOn: {
        refernceid: {
          operation: "EqualTo",
          Value: this.userDetail.user.uid
        }
      }
    };
    this.user
      .getUserLivedLocations(filter)
      .then(res => {
        this.userLocList = res;
        this.isPlaceSettingsLoad = true;
      })
      .catch(err => {
        this.isPlaceSettingsLoad = true;
        this.toast.create({
          message: "Something went wrong, please try again after sometime.",
          duration: 2000
        });
      });
  }

  getUserInfo(): void {
    let filter = {
      filterOn: {
        uid: {
          operation: "EqualTo",
          Value: this.userDetail.user.uid
        }
      }
    };
    console.log(filter);
    this.user.getUser(filter).subscribe(
      res => {
        if (res["responseObject"] != null) {
          this.userInfo = res["responseObject"][0];
          if (this.userInfo["dob"] != null) {
            this.userInfo["dob"] = this.call.getDate(this.userInfo["dob"]);
          }
        }
        this.isUserInfoSettingsLoad = true;
      },
      err => {
        this.isUserInfoSettingsLoad = true;
        this.toast.create({
          message: "Something went wrong, please try again after sometime.",
          duration: 2000
        });
      }
    );
  }

  sendMessage(): void {
    let msgBox = this.modalCtrl.create("ChatBoxPage", {
      uItem: {
        fuid: this.userId,
        tuid: this.userDetail.user.uid
      }
    });
    msgBox.present();
  }

  newPost(): void {
    let modalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };
    let newPost = this.modalCtrl.create("CreatePostPage", {}, modalOptions);
    newPost.present();
  }

  close(): void {
    this.callback = this.navParams.get("callback");

    this.callback({
      uItem: this.userDetail,
      uIndex: this.navParams.get("uIndex")
    }).then(() => {
      this.navCtrl.pop();
    });
  }
}

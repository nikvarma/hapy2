import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { UserProvider, CallProvider } from "../../providers";
import { Logging } from "../../models/logging";

/**
 * Generated class for the SubsettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-subsettings",
  templateUrl: "subsettings.html",
  providers: [UserProvider]
})
export class SubsettingsPage implements OnInit {
  title: string;
  isCallSetting: boolean = false;
  isPostSettings: boolean = false;
  isChatSettings: boolean = false;
  isSettingsLoad: boolean = false;
  logging: Logging;
  userId: string;
  userSettings = {
    id: "",
    uid: this.userId,
    voiceCall: true,
    videoCall: true,
    showCallerId: true,
    autoCallRecorder: false,
    deleteCallLogs: 30,
    voiceCallVolumn: true,
    videoCallVolumn: true,
    chatVolumn: true,
    hideStatus: false,
    hIdeDeliveredStatus: false,
    hideProfile: false,
    visibletoContactList: false,
    deleteChat: 40,
    archiveChat: 40,
    backupChat: 40,
    volumn: true,
    location: true,
    postonWall: "Everyone",
    postVisible: "Public",
    privateTracking: false,
    settingLocation: true,
    backup: false,
    notification: true,
    isActive: true,
    status: true
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private call: CallProvider,
    private user: UserProvider,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {
    this.logging = new Logging();
    this.logging.className = "SubSettings";
  }

  ionViewDidLoad() {}

  ngOnInit(): void {
    this.call
      .getValueByKey("userinfo")
      .then(res => {
        if (res != null) {
          this.userId = res["userId"];

          this.getUserSettings();
        }
      })
      .catch(err => {
        this.logging.message = err;
        this.logging.methodeName = "OnInit";
        this.call.setLoggin(this.logging);
      });
    let settingFor = this.navParams.get("settingFor");
    switch (settingFor) {
      case "call":
        this.callSetting();
        break;
      case "chat":
        this.chatSetting();
        break;
      case "post":
        this.postSetting();
        break;
      default:
        this.viewCtrl.dismiss();
    }
  }

  settingUpdate(): void {
    let loading = this.loadingCtrl.create({
      spinner: "dots",
      content: "please wait while updating settings."
    });
    loading.present();
    this.user
      .updateUserSettings(this.userSettings)
      .then(res => {
        loading.dismiss();
      })
      .catch(err => {
        loading.dismiss();
        this.toast
          .create({
            message: "Something went wrong, please try again after sometime.",
            duration: 2000
          })
          .present();
      });
  }
  getUserSettings(): void {
    let filter = {
      filterOn: {
        uid: {
          condition: "And",
          operation: "EqualTo",
          Value: this.userId
        }
      }
    };

    this.user
      .getUserSettings(filter)
      .then(res => {
        if (res != null) {
          if (res.length > 0) {
            this.userSettings = res[0];
            this.isSettingsLoad = true;
            this.call.setValueKey("usersettings", this.userSettings);
          }
        }
      })
      .catch(err => {
        this.toast
          .create({
            message: "Something went wrong, please try again after sometime.",
            duration: 2000
          })
          .present();
      });
  }

  callSetting(): void {
    this.isCallSetting = true;
    this.title = "Call Settings";
  }

  chatSetting(): void {
    this.isChatSettings = true;
    this.title = "Chat Settings";
  }

  postSetting(): void {
    this.isPostSettings = true;
    this.title = "Post Settings";
  }
}

import { Component, OnInit, ViewChild, AfterContentInit } from "@angular/core";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController
} from "ionic-angular";

//import { Settings } from "../../providers";
import { DomSanitizer } from "../../../node_modules/@angular/platform-browser";
import { Settings, CallProvider, Api, UserProvider } from "../../providers";
import { Logging } from "../../models/logging";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { ImagePicker, ImagePickerOptions } from "@ionic-native/image-picker";

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html",
  providers: [UserProvider, ImagePicker]
})
export class SettingsPage implements OnInit {
  // Our local settings object
  options: any;
  settinguserimage: HTMLDocument;
  settingsReady = false;
  userId: any;
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
  isSettingsLoad: boolean = false;
  logging: Logging;
  // @ViewChild("uploaduserimage")
  // canvasRef;
  form: FormGroup;

  profileSettings = {
    page: "profile",
    pageTitleKey: "SETTINGS_PAGE_PROFILE"
  };

  page: string = "main";
  pageTitleKey: string = "SETTINGS_TITLE";
  pageTitle: string;
  uName: string;
  uStatus: string;
  uImage: string = "assets/img/avatar-profile-picture-default-i.jpg";
  uWallImage: string;
  subSettings: any = SettingsPage;

  constructor(
    private navCtrl: NavController,
    private settings: Settings,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private translate: TranslateService,
    private modalCtrl: ModalController,
    private domSanitizer: DomSanitizer,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private call: CallProvider,
    private api: Api,
    private user: UserProvider,
    private appCtrl: App,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {
    this.logging = new Logging();
    this.logging.className = "Settings";
  }

  editProfile(): void {
    let editProfile = this.modalCtrl.create("ProfiledetailPage");
    editProfile.present();
    editProfile.onDidDismiss(res => {
      this.getUserDetails();
    });
  }

  getUserDetails(): void {
    this.user.getLoggedUser().then(res => {
      if (res != null) {
        if (res.length > 0) {
          this.call.setValueKey("userdetails", res[0]);
          this.uName = res[0]["name"];
          this.uImage =
            res[0]["profileImage"] == null
              ? this.uImage
              : res[0]["profileImage"];
          this.uStatus = res[0]["about"];
          this.uWallImage =
            res[0]["wallImage"] == null ? this.uWallImage : res[0]["wallImage"];
        }
      }
      this.userId = this.userId == null ? res[0].uId : this.userId;
    });
  }

  openBox(event: Event): void {
    event.stopPropagation();
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select Image",
      cssClass: "image-select-actionsheet",
      buttons: [
        {
          icon: "images",
          text: "Gallary",
          handler: () => {
            this.imagePicker.hasReadPermission().then(res => {
              if (res) {
                this.pickImage();
              } else {
                this.imagePicker.requestReadPermission().then(res => {
                  this.imagePicker.hasReadPermission().then(res => {
                    if (res) {
                      this.pickImage();
                    } else {
                      actionSheet.dismiss();
                    }
                  });
                });
              }
            });
          }
        },
        {
          icon: "camera",
          text: "Camera",
          handler: () => {
            const cameraOption: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            };
            this.camera.getPicture(cameraOption).then(res => {
              this.uImage = res;
            });
          }
        },
        {
          icon: "close",
          text: "Cancel",
          role: "cancel",
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  pickImage(): void {
    let pickerOption: ImagePickerOptions = {
      maximumImagesCount: 1,
      outputType: 0,
      quality: 100,
      height: 450,
      width: 450
    };
    this.imagePicker.getPictures(pickerOption).then(res => {
      for (let i = 0; i < res.length; i++) {
        this.uImage = res[i];
      }
    });
  }

  _buildForm() {
    let group: any = {
      Volumn: [this.options.Volumn],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case "main":
        break;
      case "profile":
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      //this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get("page") || this.page;
    this.pageTitleKey = this.navParams.get("pageTitleKey") || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe(res => {
      this.pageTitle = res;
    });

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  openUserProfileUpdate(): void {}

  ngOnChanges() {}

  deleteAccount(): void {
    let alert = this.alertCtrl.create({
      title: "Confirm Delete",
      message: "Do you want to delete your Hapy account?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "cancel-btn",
          handler: () => {}
        },
        {
          text: "Yes, Confirm.",
          cssClass: "confirm-btn",
          handler: () => {
            this.call.clearStorage().then(res => {
              this.appCtrl.getRootNav().setRoot(
                "TutorialPage",
                {
                  message: "We love to see you again. Hapy."
                },
                {
                  animate: true,
                  direction: "forward"
                }
              );
            });
          }
        }
      ]
    });
    alert.present();
  }

  callFunOnTimeOut(callback: any, duration: number): void {
    setTimeout(() => {
      callback;
    }, duration);
  }

  subSetting(settingName: string): void {
    if (settingName == "call") {
      this.navCtrl.push("SubsettingsPage", { settingFor: settingName });
    } else if (settingName == "chat") {
      this.navCtrl.push("SubsettingsPage", { settingFor: settingName });
    } else if (settingName == "post") {
      this.navCtrl.push("SubsettingsPage", { settingFor: settingName });
    }
  }

  openFeedBackBox(): void {
    this.navCtrl.push("AppFeedbackPage");
  }

  ngOnInit(): void {
    this.getUserDetails();
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
    //this.insertImageInCanvas();
  }

  insertUserSettings(): void {
    this.userSettings.uid = this.userId;
    this.user
      .insertUserSettings(this.userSettings)
      .then(res => {
        if (res["status"]) {
          this.userSettings.id = res["id"];
          this.call.setValueKey("usersettings", this.userSettings);
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
            this.call.setValueKey("usersettings", this.userSettings);
            this.isSettingsLoad = true;
          } else {
            this.insertUserSettings();
            this.isSettingsLoad = true;
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

  insertImageInCanvas(): void {
    this.call
      .convertToDataURLviaCanvas(
        "assets/img/draw/wallImage.jpg",
        "image/png"
      )
      .then(res => {
        // let canvas = this.canvasRef.nativeElement;
        // let context = canvas.getContext("2d");
        // let source = new Image();
        // source.onload = () => {
        //   canvas.width = source.width + 10;
        //   canvas.height = source.height + 10;
        //   context.drawImage(source, 0, 0);
        // };
        // source.src = res;
      });
  }
}

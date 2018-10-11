import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  AfterViewChecked
} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ViewController,
  ActionSheetController,
  AlertController,
  ToastController
} from "ionic-angular";
import { EditableInputboxDirective } from "../../directives/editable-inputbox/editable-inputbox";
import { MediaViewerComponent } from "../../components/media-viewer/media-viewer";
import { CallProvider } from "../../providers";
import { Logging } from "../../models/logging";
import { PostProvider } from "../../providers/post/post";

@IonicPage()
@Component({
  selector: "page-create-post",
  templateUrl: "create-post.html",
  providers: [EditableInputboxDirective, CallProvider]
})
export class CreatePostPage
  implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {
  ngAfterViewChecked(): void {
    this.editableDiv.divElement.focus();
  }
  toId: string;
  userId: string;
  uItem: any;
  backgroundSetter: string;
  postData: any = {};
  mediaURL: any[] = [];
  @ViewChild(MediaViewerComponent)
  mediaViewer: MediaViewerComponent;
  @ViewChild(EditableInputboxDirective)
  editableDiv: EditableInputboxDirective;
  logging: Logging;
  selectedTile: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private call: CallProvider,
    private post: PostProvider,
    private toast: ToastController
  ) {
    this.logging = new Logging();
    this.logging.className = "Create Post";
  }

  ionViewDidLoad() {}

  closePost(): void {
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    this.uItem = this.navParams.get("uItem");
    this.toId = this.uItem["toId"];
    this.postData.viewto = "3";
    this.call
      .getValueByKey("userinfo")
      .then(res => {
        this.userId = res.userId;
      })
      .catch(err => {
        this.logging.methodeName = "assging userId";
        this.logging.message = err;
        this.call.setLoggin(this.logging);
      });
  }

  ngAfterViewInit(): void {
    this.editableDiv.divElement.focus();
    this.mediaURL.push({
      url: "assets/img/speakers/cheetah.jpg",
      mediatype: "image",
      imageedit: true,
      id: "image_12345"
    });
    this.mediaURL.push({
      url: "https://media.publit.io/file/hapy00000000000000001.mp4#t=4",
      mediatype: "video",
      imageedit: true,
      id: "image_12346"
    });
    this.mediaURL.push({
      url: "https://media.publit.io/file/hapy00000000000000001.mp4#t=4",
      mediatype: "video",
      imageedit: true,
      id: "image_12348"
    });
  }

  ngAfterContentInit(): void {}

  postViewPrivacy(): void {
    let _privacyalet = this.alertCtrl.create({
      cssClass: "post-view-privacy select-alert",
      title: "Who can see this post?",
      inputs: [
        {
          label: "Public",
          value: "3",
          type: "radio",
          checked: this.postData.viewto == "3",
          name: "postviewprivacy"
        },
        {
          label: "Only me",
          value: "0",
          type: "radio",
          checked: this.postData.viewto == "0",
          name: "postviewprivacy"
        },
        {
          label: "Friends",
          value: "1",
          type: "radio",
          checked: this.postData.viewto == "1",
          name: "postviewprivacy"
        },
        {
          label: "Friends of friends",
          value: "2",
          type: "radio",
          checked: this.postData.viewto == "2",
          name: "postviewprivacy"
        }
      ],
      buttons: [
        {
          text: "Ok",
          handler: data => {
            this.postData.viewto = data;
          }
        }
      ]
    });
    _privacyalet.present();
  }

  openTagContactList(): void {
    let tagContact = this.modalCtrl.create("SelectcontactlistPage");
    tagContact.onDidDismiss(res => {
      this.postData.tagfriends = res["cItem"];
      console.log(this.postData.tagfriends);
    });
    tagContact.present();
  }

  openSmily(): void {
    let smileBox = this.modalCtrl.create("SmileyPage");
    smileBox.onDidDismiss(data => {
      if (data) {
        if (data.clear) {
        } else {
          this.postData.smile = {
            icon: data.icon,
            text: data.text
          };
        }
      }
    });
    smileBox.present();
  }

  locationBox(): void {
    let loc = this.modalCtrl.create("LocationPage");
    loc.present();
    loc.onDidDismiss(res => {
      this.postData.location = {
        name:
          res["name"] == null
            ? this.call.searchInChildArray(res.addrss_compnonet, "political")
            : res["name"],
        address: res.address,
        lat: res.lat,
        lng: res.lng
      };
    });
  }

  selectVideo(): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Select Video",
      cssClass: "image-select-actionsheet",
      buttons: [
        {
          icon: "videocam",
          text: "Record",
          cssClass: "video-icon-color",
          handler: () => {
            console.log("Destructive clicked");
          }
        },
        {
          icon: "film",
          text: "Gallary",
          cssClass: "film-icon-color",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          icon: "close",
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  backgroundTile(): void {
    let tileObj = this.modalCtrl.create("BackgroundTilePage");
    tileObj.onDidDismiss(data => {
      console.log(data);
      if (data && data.clear) {
        this.selectedTile = data;
        if (data.clear) {
          this.editableDiv.divElement.style.removeProperty("background");
          this.editableDiv.divElement.style.removeProperty("color");
          this.editableDiv.divElement.style.removeProperty("font-size");
          this.editableDiv.divElement.style.removeProperty("display");
          this.editableDiv.divElement.style.removeProperty("flex-direction");
          this.editableDiv.divElement.style.removeProperty("justify-content");
          this.editableDiv.divElement.style.removeProperty("text-align");
          this.editableDiv.divElement.style.removeProperty("overflow");
          this.editableDiv.divElement.style.removeProperty("height");
        } else {
          this.editableDiv.divElement.style.background =
            data.bgProperty.bgcolor;
          this.editableDiv.divElement.style.color = data.bgProperty.color;
          this.editableDiv.divElement.style.fontSize = data.bgProperty.fontsize;
          this.editableDiv.divElement.style.textAlign = "center";
          this.editableDiv.divElement.style.display = "flex";
          this.editableDiv.divElement.style.justifyContent = "center";
          this.editableDiv.divElement.style.flexDirection = "column";
          this.editableDiv.divElement.style.overflow = "auto";
          this.editableDiv.divElement.style.height = "100%";
          if (data.isText) {
            this.editableDiv.divElement.innerHTML = data.text;
          }
        }
      }
      this.editableDiv.divElement.focus();
    });
    tileObj.present();
  }

  eventBox(): void {
    this.modalCtrl.create("CreateEventPage").present();
  }

  selectImage(): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Select Image",
      cssClass: "image-select-actionsheet",
      buttons: [
        {
          icon: "images",
          text: "Gallary",
          handler: () => {
            console.log("Destructive clicked");
          }
        },
        {
          icon: "camera",
          text: "Camera",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          icon: "close",
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  createPost(): void {
    console.log(this.editableDiv.divElement.innerText);
    let posttext = this.editableDiv.divElement.innerText.trim();
    if (posttext.length < 5) {
      this.toast.create({
        message: "Write something in Post box.",
        duration: 2000
      }).present();
      return;
    }
    let saveData = {
      contenttext: {
        style: this.selectedTile,
        text: this.editableDiv.divElement.innerHTML
      },
      type: 5,
      media: this.mediaURL || {},
      visibleto: this.postData.viewto,
      location: this.postData.location || {},
      taggedto: this.postData.tagfriends,
      isbadreported: false,
      feelingicon: this.postData.smile || {},
      toid: this.toId,
      fromid: this.userId,
      isactive: true,
      status: true
    };

    this.post.savePost(saveData).then(res => {});

    this.viewCtrl.dismiss({
      msg: "Post is publishing, please wait till post get published."
    });
  }
}

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
  AlertController
} from "ionic-angular";
import { EditableInputboxDirective } from "../../directives/editable-inputbox/editable-inputbox";
import { MediaViewerComponent } from "../../components/media-viewer/media-viewer";

@IonicPage()
@Component({
  selector: "page-create-post",
  templateUrl: "create-post.html",
  providers: [EditableInputboxDirective]
})
export class CreatePostPage implements OnInit, AfterContentInit, AfterViewInit, AfterViewChecked {
  ngAfterViewChecked(): void {
    this.editableDiv.divElement.focus();
  }
  backgroundSetter: string;
  postData: any = {};
  mediaURL: any[] = [];
  @ViewChild(MediaViewerComponent)
  mediaViewer: MediaViewerComponent;
  @ViewChild(EditableInputboxDirective)
  editableDiv: EditableInputboxDirective;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    
  }

  closePost(): void {
    this.viewCtrl.dismiss();
  }

  ngOnInit(): void {
    this.postData.viewto = "public";
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

  ngAfterContentInit(): void {
    
  }

  postViewPrivacy(): void {
    let _privacyalet = this.alertCtrl.create({
      cssClass: "post-view-privacy select-alert",
      title: "Who can see this post?",
      inputs: [
        {
          label: "Public",
          value: "Public",
          type: "radio",
          checked: this.postData.viewto == "Public",
          name: "postviewprivacy"
        },
        {
          label: "Only me",
          value: "Only me",
          type: "radio",
          checked: this.postData.viewto == "Only me",
          name: "postviewprivacy"
        },
        {
          label: "Friends",
          value: "Friends",
          type: "radio",
          checked: this.postData.viewto == "Friends",
          name: "postviewprivacy"
        },
        {
          label: "Friends of friends",
          value: "Friends of friends",
          type: "radio",
          checked: this.postData.viewto == "Friends of friends",
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
    this.modalCtrl.create("SelectcontactlistPage").present();
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
    this.modalCtrl.create("LocationPage").present();
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
      if (data) {
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
    this.viewCtrl.dismiss();
  }
}

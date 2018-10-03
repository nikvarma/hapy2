import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  PopoverController
} from "ionic-angular";
import { CallProvider } from "../../providers";
import { PopoverComponent } from "../../components/popover/popover";

@IonicPage()
@Component({
  selector: "page-call-box",
  templateUrl: "call-box.html"
})
export class CallBoxPage {
  videoCallBox: HTMLVideoElement;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private call: CallProvider,
    private popoverCtrl: PopoverController
  ) {}

  peerkey: string;
  videosource: string;
  ionViewDidLoad() {
    console.log("ionViewDidLoad CallBoxPage");
  }

  moreOption(popevent): void {
    let popover = this.popoverCtrl.create(PopoverComponent, {});
    popover.present({
      ev: popevent
    });
  }

  startVideo() {
    this.call.initilizeVoiceCall(this.peerkey);

    let audioSource = "communications";
    let videoSource = "";
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoInput = devices.find(device => device.kind === "videoinput");

      let constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined },

        video: {
          deviceId: videoInput.deviceId ? { exact: videoSource } : undefined
        }
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          console.log(stream);
          this.videoCallBox.srcObject = stream;
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  closeCall(): void {
    this.viewCtrl.dismiss();
  }
}

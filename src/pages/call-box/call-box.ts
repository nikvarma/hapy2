import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  Renderer2
} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  PopoverController
} from "ionic-angular";
import { CallProvider } from "../../providers";
import { PopoverComponent } from "../../components/popover/popover";
import { PeerConnectionProvider } from "../../providers/peer-connection/peer-connection";

@IonicPage()
@Component({
  selector: "page-call-box",
  templateUrl: "call-box.html"
})
export class CallBoxPage implements OnInit {
  localStream: any;
  videosource: string;
  callingToInfo: any = {};
  callingObject: any = null;
  @ViewChild("peerkey")
  peerkey: ElementRef;
  @ViewChild("videoCallMyBox", { read: ElementRef })
  videoCallMyBox: ElementRef;
  @ViewChild("videoCallEndBox", { read: ElementRef })
  videoCallEndBox: ElementRef;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private call: CallProvider,
    private peerConnection: PeerConnectionProvider,
    private popoverCtrl: PopoverController,
    private renderer: Renderer2
  ) {}

  ionViewDidLoad() {
    // this.peerConnection.callingObject.subscribe(res => {
    //   this.callingObject = res;
    // });
  }

  ngOnInit(): void {
    //this.callingToInfo = this.navParams.get("uItem");
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(stream => {
        this.localStream = stream;
      })
      .catch(err => {
        console.log(err);
      });
  }

  moreOption(popevent): void {
    let popover = this.popoverCtrl.create(PopoverComponent, {});
    popover.present({
      ev: popevent
    });
  }

  makeCall(): void {
    this.callingToInfo.id = this.peerkey.nativeElement.value;
    this.videoCallMyBox.nativeElement.srcObject = this.localStream;
    const call = this.peerConnection.peer.call(
      this.callingToInfo.id,
      this.localStream
    );
    this.sendCallRequest(call);
  }

  pickCall(): void {
    if (this.callingObject != null) {
      this.callingObject.answer(this.localStream);
      this.sendCallRequest(this.callingObject);
    }
  }

  sendCallRequest(call: any): void {
    call.on("stream", stream => {
      const ele = this.videoCallEndBox.nativeElement;
      ele.srcObject = stream;
      ele.play();
      console.log("SendCallRequest");
    });
    call.on("close", resEnd => {
      console.log("End Call");
      console.log(resEnd);
    });
  }

  endCall(): void {
    if (this.callingObject != null) {
      this.callingObject.close();
    }
  }

  closeCall(): void {
    this.endCall();
    this.viewCtrl.dismiss();
  }
}

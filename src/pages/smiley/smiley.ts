import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { SmileyProvider } from "../../providers";


@IonicPage()
@Component({
  selector: "page-smiley",
  templateUrl: "smiley.html"
})
export class SmileyPage implements OnInit {
  smiles: any = [];
  sendData: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private smiley: SmileyProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SmileyPage");
  }

  closeBtn(data): void { 
    (data) ? this.sendData.clear = true : this.sendData.clear = false;
    this.viewCtrl.dismiss(this.sendData);
  }

  addIcon(data): void {
    this.viewCtrl.dismiss(data);
  }
  
  ngOnInit(): void {
    this.smiley.smileyLoad().then((smiles: any[]) => {
      this.smiles = smiles;
    });
  }
}

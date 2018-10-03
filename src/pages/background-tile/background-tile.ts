import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

/**
 * Generated class for the BackgroundTilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-background-tile",
  templateUrl: "background-tile.html"
})
export class BackgroundTilePage implements OnInit {
  bgColors: any[] = [];
  sendData: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.sendData.clear = false;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad BackgroundTilePage");
  }

  closeBtn(data: any): void {    
    (data) ? this.sendData.clear = true : this.sendData.clear = false;
    this.viewCtrl.dismiss(this.sendData);
  }

  ngOnInit(): void {
    this.loadBGColors();
  }

  applyTile(bgColor: any): void {
    this.viewCtrl.dismiss(bgColor);
  }

  loadBGColors(): void {
    this.bgColors.push(
      {
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(0, 210, 255), rgb(58, 123, 213))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Reef. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(239, 50, 217), rgb(137, 255, 253))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Azure Pop. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(203, 45, 62), rgb(239, 71, 58))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Firewatch. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(0, 4, 40), rgb(0, 78, 146))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Frost. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(44, 62, 80), rgb(76, 161, 175))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Deep Sea Space. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(233, 100, 67), rgb(144, 78, 149))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Grapefruit Sunset. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Sweet Morning. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(255, 75, 31), rgb(31, 221, 255))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Ali. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(186, 83, 112), rgb(244, 226, 216))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Purple White. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(76, 161, 175), rgb(196, 224, 229))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Decent. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(41, 128, 185), rgb(44, 62, 80))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Nighthawk. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(77, 160, 176), rgb(211, 157, 56))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Miami Dolphins. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(86, 20, 176), rgb(219, 214, 92))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Minnesota Vikings. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(30, 60, 114), rgb(42, 82, 152))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Joomla. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(69, 127, 202), rgb(86, 145, 200))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Inbox. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(178, 69, 146), rgb(241, 95, 121))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Blush. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(194, 229, 156), rgb(100, 179, 244))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Green and Blue. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(0, 201, 255), rgb(146, 254, 157))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Back To Earth. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(244, 107, 69), rgb(238, 168, 73))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Master Card. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(0, 92, 151), rgb(54, 55, 149))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Clear Sky. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(229, 57, 53), rgb(227, 93, 91))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Passion. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(252, 0, 255), rgb(0, 219, 222))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Timber. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(123, 67, 151), rgb(220, 36, 48))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Virgin America. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(19, 106, 138), rgb(38, 120, 113))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Turquoise flow. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(254, 172, 94), rgb(199, 121, 208), rgb(75, 192, 200))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Atlas. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(67, 206, 162), rgb(24, 90, 157))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Endless River. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(112, 225, 245), rgb(255, 209, 148))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Shore. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(185, 147, 214), rgb(140, 166, 219))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Dirty Fog. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Nelson. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(194, 21, 0), rgb(255, 197, 0))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Kyoto. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(222, 98, 98), rgb(255, 184, 140))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "A Lost Memory. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(213, 51, 105), rgb(203, 173, 109))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Blurry Beach. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(248, 87, 166), rgb(255, 88, 88))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Day Tripper. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(252, 53, 76), rgb(10, 191, 188))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Miaka. Feel the color."
    },{
      bgProperty: {
        bgcolor:
          "linear-gradient(to right, rgb(95, 44, 130), rgb(73, 160, 157))",
        color: "white",
        fontsize: "2.0rem"
      },
      text: "Calm Darya. Feel the color."
    },
  );
  }
}

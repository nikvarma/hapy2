import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  MenuController,
  NavController,
  Platform,
  NavParams,
  ToastController
} from "ionic-angular";

import { TranslateService } from "@ngx-translate/core";

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: "page-tutorial",
  templateUrl: "tutorial.html"
})
export class TutorialPage implements OnInit {
  ngOnInit(): void {
    let msgAfterLogout = this.navParams.get("message");
    if (msgAfterLogout != null) {
      console.log(msgAfterLogout);
      setTimeout(() => {
        this.toast.create({
          message: msgAfterLogout,
          duration: 2000
        });
      }, 1500);
    }
  }
  slides: Slide[];
  showSkip = true;
  dir: string = "ltr";

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    translate: TranslateService,
    public platform: Platform,
    private navParams: NavParams,
    private toast: ToastController
  ) {
    this.dir = platform.dir();
    translate
      .get([
        "TUTORIAL_SLIDE1_TITLE",
        "TUTORIAL_SLIDE1_DESCRIPTION",
        "TUTORIAL_SLIDE2_TITLE",
        "TUTORIAL_SLIDE2_DESCRIPTION",
        "TUTORIAL_SLIDE3_TITLE",
        "TUTORIAL_SLIDE3_DESCRIPTION"
      ])
      .subscribe(values => {
        console.log("Loaded values", values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: "assets/img/draw/hapy-world-trans-2.png"
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: "assets/img/draw/Hapy-slide-2v.png"
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: "assets/img/draw/WebsiteGraphics_v2.png"
          }
        ];
      });
  }

  startApp() {
    this.navCtrl.setRoot(
      "WelcomePage",
      {},
      {
        animate: true,
        direction: "forward"
      }
    );
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  ModalOptions,
  ToastController,
  Events
} from "ionic-angular";
import { AnimateContentLoadDirective } from "../../directives/animate-content-load/animate-content-load";
import { CallProvider } from "../../providers";

@IonicPage()
@Component({
  selector: "page-posts",
  templateUrl: "posts.html",
  animations: [AnimateContentLoadDirective.FadeOnLoad]
})
export class PostsPage implements OnInit {
  cardItems: any[];
  userId: string;
  constructor(
    private call: CallProvider,
    public navCtrl: NavController,
    public navaParam: NavParams,
    private events: Events,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
    this.cardItems = [
      {
        user: {
          avatar: "assets/img/marty-avatar.png",
          name: "Marty McFly"
        },
        date: "November 5, 1955",
        image: "assets/img/advance-card-bttf.png",
        content:
          "Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy."
      },
      {
        user: {
          avatar: "assets/img/sarah-avatar.png.jpeg",
          name: "Sarah Connor"
        },
        date: "May 12, 1984",
        image: "assets/img/advance-card-tmntr.jpg",
        content:
          "I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too."
      },
      {
        user: {
          avatar: "assets/img/ian-avatar.png",
          name: "Dr. Ian Malcolm"
        },
        date: "June 28, 1990",
        image: "assets/img/advance-card-jp.jpg",
        content:
          "Your scientists were so preoccupied with whether or not they could, that they didn't stop to think if they should."
      }
    ];
  }

  newPost(): void {
    let modalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };
    let newPost = this.modalCtrl.create(
      "CreatePostPage",
      {
        uItem: {
          toId: this.userId
        }
      },
      modalOptions
    );
    newPost.present();
    newPost.onDidDismiss(res => {
      if (res) {
        this.toastCtrl
          .create({
            message: "Post is publishing, please wait till post get published.",
            duration: 2000
          })
          .present();
      }
    });

    //this.navCtrl.push("AppFeedbackPage");
  }

  openProfile(): void {
    this.navCtrl.push("ViewProfilePage");
  }

  doRefresh(refresher): void {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  doInfinite(infiniteScroll): void {
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500);
  }

  ngOnInit(): void {
    this.call
      .getValueByKey("userinfo")
      .then(res => {
        this.userId = res.userId;
      })
      .catch(err => {});
    this.events.subscribe("post:request", res => {
      this.toastCtrl.create({
        message: "Post publised successfully.",
        duration: 2000
      }).present();
      console.log(res);
    });
  }

  ionViewDidLoad() {}
}

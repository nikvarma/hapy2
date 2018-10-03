import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  App
} from "ionic-angular";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/map";
import { Item } from "../../models/item";
import { Items, UserProvider, CallProvider, Api } from "../../providers";
import { Logging } from "../../models/logging";
import { FormControl } from "@angular/forms";
import { Endpoints } from "../../config/Endpoints";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html",
  providers: [UserProvider, CallProvider]
})
export class SearchPage implements OnInit {
  currentItems: any = [];
  userId: string;
  logging: Logging;
  searchText: string;
  isSearching: boolean = false;
  debounceTimeSearch: FormControl;
  searchList: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public items: Items,
    private api: Api,
    private call: CallProvider,
    private user: UserProvider,
    private toast: ToastController,
    private appCtrl: App
  ) {
    this.logging = new Logging();
    this.logging.className = "SearchPage";
    this.debounceTimeSearch = new FormControl();
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }

  openItem(item: Item) {
    this.navCtrl.push("ItemDetailPage", {
      item: item
    });
  }

  callBackSearch = (item: any): any => {
    return new Promise((resolve, reject) => {
      if (item.uItem != null) {
        if (item.uItem.user.friend != null) {
          this.searchList[item.uIndex].user.friend =
            item.uItem.user.friend || null;
        }
      }
      resolve();
    });
  };

  openProfile(item: number): void {
    this.navCtrl.push("ViewProfilePage", {
      uItem: this.searchList[item] || null,
      uIndex: item,
      callback: this.callBackSearch
    });
  }

  ionViewDidLoad() {
    this.debounceTimeSearch.valueChanges.debounceTime(700).subscribe(search => {
      this.isSearching = true;
      if (search.length > 0) {
        this.getSearchList();
      } else {
        this.isSearching = false;
      }
    });
  }

  getSearchList(): void {
    let filter = {
      SearchBy: this.userId,
      searchText: this.searchText,
      pageNumber: 1,
      pageSize: 20,
      searchOn: "username",
      searchType: "user"
    };

    this.api.post(Endpoints.api.news + "v1/search/users", filter).subscribe(
      res => {
        if (res["jsonResult"] != null) {
          this.searchList = JSON.parse(res["jsonResult"]);
          for (let index = 0; index < this.searchList.length; index++) {
            this.searchList[index].user.spinner = false;
          }
          this.isSearching = false;
        } else {
          this.isSearching = false;
          this.searchList = [];
        }
        //console.log(JSON.parse(res["jsonResult"]));
      },
      err => {
        this.logging.message = err;
        this.logging.methodeName = "getSearchList";
        this.call.setLoggin(this.logging);
      }
    );
  }

  unFriendRequest(event: Event, item: number): void {
    event.stopPropagation();
    let sendData = this.searchList[item].user.friend;
    this.searchList[item].user.spinner = true;
    this.api
      .post(Endpoints.api.user + "v1/userrequest/remove", sendData)
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.searchList[item].user.spinner = false;
            this.searchList[item].user.friend = null;
          } else {
            this.toast
              .create({
                message:
                  "Unable to send request, please try again after sometime.",
                duration: 2000
              })
              .present();
            this.searchList[item].user.spinner = false;
          }
        },
        err => {
          this.toast
            .create({
              message:
                "Unable to send request, please try again after sometime.",
              duration: 2000
            })
            .present();
          this.searchList[item].user.spinner = false;
          this.logging.message = err;
          this.logging.methodeName = "unFriendRequest";
          this.call.setLoggin(this.logging);
        }
      );
  }

  sendFriendRequest(event: Event, item: number): void {
    event.stopPropagation();
    if (this.searchList[item].user.friend != null) {
      if (this.searchList[item].user.friend.isblocked == true) {
        return;
      }
    }
    let saveData = {
      fromId: this.userId,
      toId: this.searchList[item].user.uid,
      requestmessage: "I would like to be your friend.",
      isrequestaccpted: false,
      isblocked: false,
      status: true
    };
    this.searchList[item].user.spinner = true;
    this.api
      .post(Endpoints.api.user + "v1/userrequest/add", saveData)
      .subscribe(
        res => {
          if (res["responseObject"] != null) {
            this.searchList[item].user.friend = {
              fid: saveData.fromId,
              tid: saveData.toId,
              isaccpted: saveData.isrequestaccpted,
              isblocked: saveData.isblocked,
              id: res["responseObject"]["id"]
            };

            this.searchList[item].user.spinner = false;
          } else {
            this.searchList[item].user.spinner = false;
            this.toast.create({
              message:
                "Unable to send friend request, please try again after sometime.",
              duration: 2000
            });
          }
        },
        err => {
          this.searchList[item].user.spinner = false;
          this.toast.create({
            message:
              "Unable to send friend request, please try again after sometime.",
            duration: 2000
          });
          this.logging.methodeName = "sendFriendRequest";
          this.logging.message = err;
          this.call.setLoggin(this.logging);
        }
      );
  }

  imageSetDefault(): void {
    console.log("Okk");
  }

  ngOnInit(): void {
    this.call.getValueByKey("userinfo").then(res => {
      this.userId = res.userId;
      console.log(this.userId);
    });
  }
}

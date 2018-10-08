import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { TranslateService } from "@ngx-translate/core";
import { Config, Nav, Platform } from "ionic-angular";

import { FirstRunPage, MainPage } from "../pages";
import {
  Api,
  InitloadProvider,
  CallProvider,
  UserProvider,
  SqlStorageProvider
} from "../providers";
import { Endpoints } from "../config/Endpoints";
import { Logging } from "../models/logging";
import { PeerConnectionProvider } from "../providers/peer-connection/peer-connection";
import { NetworkConnectionProvider } from "../providers/network-connection/network-connection";

@Component({
  templateUrl: "app.html"
})
export class HapyApp {
  rootPage: any; // = FirstRunPage;

  logging: Logging;
  @ViewChild(Nav)
  nav: Nav;

  pages: any[] = [
    { title: "Tutorial", component: "TutorialPage" },
    { title: "Welcome", component: "WelcomePage" },
    { title: "Tabs", component: "TabsPage" },
    { title: "Settings", component: "SettingsPage" },
    { title: "Search", component: "SearchPage" },
    { title: "Messages", component: "MessagePage" },
    { title: "Posts", component: "PostsPage" },
    { title: "Calls", component: "CallsPage" }
  ];

  constructor(
    private translate: TranslateService,
    platform: Platform,
    private api: Api,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private initLoad: InitloadProvider,
    private call: CallProvider,
    private user: UserProvider,
    private networkConnection: NetworkConnectionProvider,
    private peerConnection: PeerConnectionProvider,
    private sqlLite: SqlStorageProvider
  ) {
    this.logging = new Logging();

    this.logging.className = "AppComponent";
    platform.ready().then(() => {
      this.logging.methodeName = "Constructor called";

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.logging.message = "platform ready event executing";

      this.api.post(
        Endpoints.api.appsettings + "v1/logging/setlogging",
        this.logging
      );
      //Network check, Online or Offline
      this.networkConnection.initializeNetworkEvent();
      //this.sqlLite.createSQLLiteDB();
      this.initLoad.isPlatform("android").then(res => {
        this.initLoad.isPlatform("cordova").then(res => {
          if (res == true) {
          }
        });
      });
    });
    //User check if user is already logged in or is not
    this.user.getLoggedUser().then(res => {
      if (res != null) {
        if (res.length > 0) {
          this.rootPage = MainPage;
          this.peerConnection.initilizePeer(false);
          this.initLoad.loginToFirebase(res[0].uId);
          this.initLoad.verifyToken();
        } else {
          this.rootPage = FirstRunPage;
        }
      } else {
        this.rootPage = FirstRunPage;
      }
    });

    //Append required vendor scripts file
    this.initLoad.appendScripts();

    //Active translator for the App
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang("en");
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === "zh") {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use("zh-cmn-Hans");
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use("zh-cmn-Hant");
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use("en"); // Set your language here
    }

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);

      //Scroll fixs for Android and Other Platforms
      this.config.set("scrollPadding", false);
      this.config.set("scrollAssist", false);
      this.config.set("autoFocusAssist", false);
      this.config.set("android", "scrollAssist", true);
      this.config.set("android", "autoFocusAssist", "delay");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { Camera } from "@ionic-native/camera";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule, Storage } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { Items } from "../mocks/providers/items";
import {
  Settings,
  UserProvider,
  Api,
  SmileyProvider,
  InitloadProvider,
  CallProvider
} from "../providers";
import { HapyApp } from "./app.component";
import { ComponentsModule } from "../components/components.module";
import { PopOverModule } from "../components/popover/popover.module";
import { MediaViewerModule } from "../components/media-viewer/media-viewer.module";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireModule } from "angularfire2";
import { FirebaseConfig } from "../config/FirebaseConfig";
import { ConnectivityServiceProvider } from "../providers/connectivity-service/connectivity-service";
import { GoogleMapsProvider } from "../providers/google-maps/google-maps";

import { Geolocation } from "@ionic-native/geolocation";
import { Network } from "@ionic-native/network";
import { CallchatmessageProvider } from "../providers/callchatmessage/callchatmessage";
import { MessagesProvider } from "../providers/messages/messages";
import { SqlStorageProvider } from "../providers/sql-storage/sql-storage";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

import { SQLiteMock } from "../mocks/providers/SQLiteMock";
import { PeerConnectionProvider } from '../providers/peer-connection/peer-connection';
import { NetworkConnectionProvider } from '../providers/network-connection/network-connection';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: "Ionitron J. Framework",
    option3: "3",
    option4: "Hello"
  });
}

@NgModule({
  declarations: [HapyApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    PopOverModule,
    MediaViewerModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(HapyApp),
    IonicStorageModule.forRoot({
      name: "__HapyDB",
      storeName: "HapyDB",
      driverOrder: ["sqlite", "websql", "indexedDB"]
    }),
    AngularFireModule.initializeApp(FirebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [HapyApp],
  providers: [
    Api,
    Items,
    UserProvider,
    Camera,
    SmileyProvider,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // Keep this to enable Ionic's runtime error handling during development
    //{ provide: SQLite, useClass: SQLiteMock },
    CallProvider,
    InitloadProvider,
    ConnectivityServiceProvider,
    GoogleMapsProvider,
    Network,
    SQLite,
    Geolocation,
    UserProvider,
    CallchatmessageProvider,
    MessagesProvider,
    SqlStorageProvider,
    PeerConnectionProvider,
    NetworkConnectionProvider
  ]
})
export class AppModule {}

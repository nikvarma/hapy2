import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from "ionic-angular";

import { SettingsPage } from "./settings";
//import { Settings } from "../../providers";

@NgModule({
  declarations: [SettingsPage],
  imports: [IonicPageModule.forChild(SettingsPage), TranslateModule.forChild()],
  //providers: [Settings],
  exports: [SettingsPage]
})
export class SettingsPageModule {}

import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SelectcontactlistPage } from "./selectcontactlist";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [SelectcontactlistPage],
  imports: [
    IonicPageModule.forChild(SelectcontactlistPage),
    TranslateModule.forChild()
  ]
})
export class SelectcontactlistPageModule {}

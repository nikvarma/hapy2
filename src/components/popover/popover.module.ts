import { NgModule } from "@angular/core";
import { PopoverComponent } from "./popover";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [PopoverComponent],
  imports: [IonicPageModule.forChild(PopoverComponent)],
  entryComponents: [PopoverComponent]
})
export class PopOverModule {}

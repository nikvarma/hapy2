import { NgModule } from "@angular/core";

import { TranslateModule } from "../../node_modules/@ngx-translate/core";
import { PopoverComponent } from "./popover/popover";
import { PopOverModule } from "./popover/popover.module";
import { MediaViewerComponent } from "./media-viewer/media-viewer";
import { MediaViewerModule } from "./media-viewer/media-viewer.module";

@NgModule({
  declarations: [],
  imports: [TranslateModule.forChild()],
  exports: []
})
export class ComponentsModule {}

import { NgModule } from "@angular/core";
import { MediaViewerComponent } from "./media-viewer";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [MediaViewerComponent],
  imports: [IonicPageModule.forChild(MediaViewerComponent)],
  entryComponents: [MediaViewerComponent]
})
export class MediaViewerModule {}

import { NgModule } from "@angular/core";
import { EditableInputboxDirective } from "./editable-inputbox/editable-inputbox";
import { MediaViewerDirective } from "./media-viewer/media-viewer";
import { CanvasBoxDirective } from "./canvas-box/canvas-box";
@NgModule({
  declarations: [
    EditableInputboxDirective,
    MediaViewerDirective,
    CanvasBoxDirective
  ],
  imports: [],
  exports: [
    EditableInputboxDirective,
    MediaViewerDirective,
    CanvasBoxDirective
  ]
})
export class DirectivesModule {}

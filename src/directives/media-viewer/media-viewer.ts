import { Directive, Input } from "@angular/core";

/**
 * Generated class for the MediaViewerDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: "media-viewer", // Tag selector
  
  inputs: ["mediaurl"]
})
export class MediaViewerDirective {
  @Input("mediaurl") mediaURL: any[] = [];

  constructor() {
    console.log("Hello MediaViewerDirective Directive");
  }
}

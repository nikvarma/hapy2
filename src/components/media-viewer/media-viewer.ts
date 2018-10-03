import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from "@angular/core";
import { Slides, IonicPage } from "ionic-angular";


@IonicPage()
@Component({
  selector: "media-viewer",
  templateUrl: "media-viewer.html",
  inputs: ["mediaurl"]
})

export class MediaViewerComponent {
  @Input("mediaurl") mediaURL: any[] = [];

  @ViewChild(Slides) slides: Slides;
  text: string;

  constructor(private elementRef: ElementRef) {
    console.log("Hello MediaViewerComponent Component");
    this.text = "Hello World";
  }

  ngAfterViewInit(): void {}

  editImage(data: any): void {}

  rangUpdated(): void {}
}

import { Directive, Input, Renderer2, ElementRef } from "@angular/core";

/**
 * Generated class for the CanvasBoxDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: "canvas-box", // Attribute selector
  inputs: ["url-src"]
})
export class CanvasBoxDirective {
  @Input("url-src") srcURL: string;
  canvasEle: HTMLCanvasElement;
  elementRef: HTMLElement;
  constructor(private render2: Renderer2, private eleRef: ElementRef) {
    this.elementRef = this.eleRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.canvasEle = this.render2.createElement("canvas");
    this.canvasEle.id = "imageCanvasID";//"imageCanvas_" + Math.ceil(88*Math.random());
    this.render2.appendChild(this.elementRef, this.canvasEle);
    
    let _canvas = this.canvasEle.getContext("2d");
    _canvas.fill();
    let _img = new Image();
    _img.onload = () => {
      this.canvasEle.width = _img.width;
      this.canvasEle.height = _img.height;
      _canvas.drawImage(_img, 0, 0);
    };
    _img.src = this.srcURL;
  }
}

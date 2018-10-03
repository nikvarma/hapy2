import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter
} from "@angular/core";

/**
 * Generated class for the EditableInputboxDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: "editable-inputbox", // Attribute selector
  host: {
    "(onkeypress)": "onKeyPress($event)"
  },
  inputs: ["forecolor", "background", "elementstyle"]
})
export class EditableInputboxDirective {
  private htmlElement = HTMLElement;
  @Input("forecolor") foreColor;
  @Input("background") backGround;
  @Input("elementstyle") elementStyle;
  @Output("openmodal") openModal = new EventEmitter();
  bgPaint: string;
  elemStyle: any;
  divElement: HTMLElement;
  constructor(elementRef: ElementRef, public render2: Renderer2) {
    this.htmlElement = elementRef.nativeElement;
  }

  onKeyPress(event: any): void {
    console.log(event);
  }

  ngAfterViewInit() {
    this.createDivElement();
  }

  private createDivElement() {
    this.divElement = this.render2.createElement("div");
    this.divElement.contentEditable = "true";
    
    this.divElement.setAttribute(
      "style",
      "width: 100%; min-height: 300px;"
    );
    this.divElement.setAttribute("id", "contenteditable-container");
    
    this.render2.appendChild(this.htmlElement, this.divElement);
  }



  private positionSetter(editableDiv: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      var caretPos = 0,
        sel,
        range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          console.log(range);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      }
      resolve(caretPos);
    });
  }
}

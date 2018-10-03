import {
  trigger,
  style,
  state,
  transition,
  animate,
  Input
} from "@angular/core";

export class AnimateContentLoadDirective {
  constructor() {}

  public static FadeOnLoad = trigger("fadeInOut", [
    state("void", style({ display: "none", opacity: "0" })),
    state("*", style({ display: "block", opacity: "1" })),
    transition("void <=> *", animate("150ms ease-in"))
  ]);
}

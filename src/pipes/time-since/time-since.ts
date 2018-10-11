import { Pipe, PipeTransform } from "@angular/core";
import { CallProvider } from "../../providers";

@Pipe({
  name: "timeSince"
})
export class TimeSincePipe implements PipeTransform {
  constructor(private call: CallProvider) {}
  transform(value: number, ...args) {
    let sincetime = this.call.timeSince(value);
    return sincetime;
  }
}

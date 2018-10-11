import { NgModule } from "@angular/core";
import { TimeSincePipe } from "./time-since/time-since";
@NgModule({
  declarations: [TimeSincePipe],
  imports: [],
  exports: [TimeSincePipe]
})
export class PipesModule {
  static forRoot() {
    return {
      ngModule: PipesModule,
      providers: [TimeSincePipe]
    };
  }
}

import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CreatePostPage } from "./create-post";
import { TranslateModule } from "../../../node_modules/@ngx-translate/core";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [CreatePostPage],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(CreatePostPage),
    TranslateModule.forChild()
  ],
  providers: [],
  exports: [CreatePostPage]
})
export class CreatePostPageModule {}

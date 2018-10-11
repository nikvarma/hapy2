import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ChatBoxPage } from "./chat-box";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ChatBoxPage],
  imports: [PipesModule.forRoot(), IonicPageModule.forChild(ChatBoxPage)]
})
export class ChatBoxPageModule {}

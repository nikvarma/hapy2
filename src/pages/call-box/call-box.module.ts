import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallBoxPage } from './call-box';

@NgModule({
  declarations: [
    CallBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(CallBoxPage),
  ],
})
export class CallBoxPageModule {}

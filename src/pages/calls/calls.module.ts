import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallsPage } from './calls';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    CallsPage,
  ],
  imports: [
    IonicPageModule.forChild(CallsPage),
    TranslateModule.forChild()
  ],
  exports: [
    CallsPage
  ]
})
export class CallsPageModule {}

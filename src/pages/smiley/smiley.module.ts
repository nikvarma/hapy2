import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmileyPage } from './smiley';

@NgModule({
  declarations: [
    SmileyPage,
  ],
  imports: [
    IonicPageModule.forChild(SmileyPage),
  ],
})
export class SmileyPageModule {}

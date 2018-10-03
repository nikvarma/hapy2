import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadingBoxPage } from './reading-box';

@NgModule({
  declarations: [
    ReadingBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadingBoxPage),
  ],
})
export class ReadingBoxPageModule {}

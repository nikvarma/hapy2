import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackgroundTilePage } from './background-tile';

@NgModule({
  declarations: [
    BackgroundTilePage,
  ],
  imports: [
    IonicPageModule.forChild(BackgroundTilePage),
  ],
})
export class BackgroundTilePageModule {}

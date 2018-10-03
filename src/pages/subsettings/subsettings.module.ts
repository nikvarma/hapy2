import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubsettingsPage } from './subsettings';

@NgModule({
  declarations: [
    SubsettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SubsettingsPage),
  ],
})
export class SubsettingsPageModule {}

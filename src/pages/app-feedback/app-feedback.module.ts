import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppFeedbackPage } from './app-feedback';

@NgModule({
  declarations: [
    AppFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(AppFeedbackPage),
  ],
})
export class AppFeedbackPageModule {}

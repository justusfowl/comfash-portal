import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { FittingStreamComponent } from './pages/fitting-stream/fitting-stream.component';
import { MyRoomComponent } from './pages/my-room/my-room.component';
import { ImgCollectionComponent } from './pages/img-collection/img-collection.component';
import { ContentComponent } from './pages/content/content.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { InspireComponent } from './pages/inspire/inspire.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { GestureConfig} from '@angular/material';

import { MaterialAppModule } from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { CommentDialogComponent } from './comp/comment-dialog/comment-dialog.component';
import { PopoverModule } from './comp/vote';

import { 
  DynamicActivityComponent, 
  ActivityComponentComment, 
  ActivityComponentFollows, 
  UnknownDynamicComponent 
} from './comp/activities/activities.component';

import { FileDropModule } from 'ngx-file-drop';

import { UtilService } from './services/util.service';
import { ApiService } from './services/api.service';

import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { HttpClientModule } from '@angular/common/http';






@NgModule({
  declarations: [
    AppComponent,

    FittingStreamComponent,
    MyRoomComponent,
    ImgCollectionComponent,
    ContentComponent,
    CaptureComponent,
    InspireComponent, 
    CommentDialogComponent, 
    ProfileComponent,
    LoginComponent,

    DynamicActivityComponent, 
    ActivityComponentComment, 
    ActivityComponentFollows, 
    UnknownDynamicComponent

  ],
  imports: [
    BrowserAnimationsModule, 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialAppModule,
    AppRoutingModule, 
    FileDropModule,

    Ng4LoadingSpinnerModule.forRoot(),

    HttpClientModule, 
    PopoverModule
    
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, 
    UtilService,
    ApiService
  ],
  bootstrap: [AppComponent], 
  entryComponents: [
    CommentDialogComponent, 
 
    ActivityComponentComment, 
    ActivityComponentFollows, 
    UnknownDynamicComponent
  ]
})
export class AppModule { }

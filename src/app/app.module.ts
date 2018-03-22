import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { FittingStreamComponent } from './pages/fitting-stream/fitting-stream.component';
import { MyRoomComponent } from './pages/my-room/my-room.component';
import { ImgCollectionComponent } from './pages/img-collection/img-collection.component';
import { ContentComponent } from './pages/content/content.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { LoafComponent } from './pages/loaf/loaf.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {  GestureConfig, MatSliderModule } from '@angular/material';



@NgModule({
  declarations: [
    AppComponent,

    FittingStreamComponent,
    MyRoomComponent,
    ImgCollectionComponent,
    ContentComponent,
    CaptureComponent,
    LoafComponent
  ],
  imports: [
    BrowserAnimationsModule, 
    MatSliderModule,
    BrowserModule,
    AppRoutingModule
    
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

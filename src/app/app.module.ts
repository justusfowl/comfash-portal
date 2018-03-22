import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { FittingStreamComponent } from './pages/fitting-stream/fitting-stream.component';
import { MyRoomComponent } from './pages/my-room/my-room.component';
import { ImgCollectionComponent } from './pages/img-collection/img-collection.component';
import { ContentComponent } from './pages/content/content.component';
import { CaptureComponent } from './pages/capture/capture.component';



@NgModule({
  declarations: [
    AppComponent,

    FittingStreamComponent,
    MyRoomComponent,
    ImgCollectionComponent,
    ContentComponent,
    CaptureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

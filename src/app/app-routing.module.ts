import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';     // Add this

import { FittingStreamComponent } from './pages/fitting-stream/fitting-stream.component';
import { MyRoomComponent } from './pages/my-room/my-room.component';
import { ImgCollectionComponent } from './pages/img-collection/img-collection.component';
import { ContentComponent } from './pages/content/content.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { LoafComponent } from './pages/loaf/loaf.component';


const routes: Routes = [
  {
    path: '',
    component: MyRoomComponent
  },
  {
    path: 'imgCollection',
    component: ImgCollectionComponent
  },
  {
    path: 'stream',
    component: FittingStreamComponent
  },
  {
    path: 'content',
    component: ContentComponent
  }, 
  {
    path: 'loaf',
    component: LoafComponent
  }, 
  {
    path: 'capture',
    component: CaptureComponent
  }


];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

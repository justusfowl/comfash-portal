import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { FittingStreamComponent } from './pages/fitting-stream/fitting-stream.component';
import { MyRoomComponent } from './pages/my-room/my-room.component';
import { ImgCollectionComponent } from './pages/img-collection/img-collection.component';
import { ContentComponent } from './pages/content/content.component';
import { CaptureComponent } from './pages/capture/capture.component';
import { InspireComponent } from './pages/inspire/inspire.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

import { CatchallComponent } from './pages/catchall/catchall.component';

const routes: Routes = [

    {        
      path: 'room',
      children: [
          {
              path: ':userId',
              children: [
                  {
                      path: '',    
                      component: MyRoomComponent,
                  },
                  {
                      
                      path: ':collectionId',
                      component: ImgCollectionComponent
                  }
              ]
          }
      ]    
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
    path: 'inspire',
    component: InspireComponent
  }, 
  {
    path: 'capture',
    component: CaptureComponent
  }, 
  {
    path: 'profile/:userId',
    component: ProfileComponent
  }, 
  {
    path: 'login',
    component: LoginComponent
  },
  
  {
    path: "",
    pathMatch: 'full',
    redirectTo: 'stream',
  },
  {
    path: "**",
    component: CatchallComponent,
  }
  

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

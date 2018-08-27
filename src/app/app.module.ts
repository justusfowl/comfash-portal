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
import { CatchallComponent } from './pages/catchall/catchall.component';

import { AdminAnalysisComponent } from './pages/admin/analysis/analysis.component';
import { SearchMetaComponent } from './pages/admin/search-meta/search-meta.component';
import { SearchMetaItemComponent } from './pages/admin/search-meta/search-meta-item/search-meta-item.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { GestureConfig} from '@angular/material';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

import { MaterialAppModule } from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { CommentDialogComponent } from './comp/comment-dialog/comment-dialog.component';
import { AddCollectionComponent } from './comp/add-collection/add-collection.component';

import { InputDebounceDirective } from "./directives/input-debounce/input-debounce.directive";
import { LinkUsernameDirective } from './directives/link-username/link-username.directive';
import { LinkCollectionDirective } from './directives/link-collection/link-collection.directive';
import { PopoverModule } from './comp/vote';

import { 
  DynamicActivityComponent,
  ActivityComponentVote, 
  ActivityComponentComment, 
  ActivityComponentFollows, 
  UnknownDynamicComponent 
} from './comp/activities/activities.component';

import { FileDropModule } from 'ngx-file-drop';

import { UtilService } from './services/util.service';
import { ApiService } from './services/api.service';
import { NotificationService } from './services/notification.service';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService} from './services/auth.service';
import { ConfigService } from './services/config.service';


import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/auth.intercept.service';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';


export function tokenGetter() {
  return localStorage.getItem('access_token');
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


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
    AddCollectionComponent,
    InputDebounceDirective,
    LinkUsernameDirective,
    LinkCollectionDirective,
    ProfileComponent,
    LoginComponent,
    CatchallComponent,

    AdminAnalysisComponent,
    SearchMetaComponent,
    SearchMetaItemComponent,

    DynamicActivityComponent, 
    ActivityComponentVote,
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
    TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['comfash.local:9999/api/v01'],
        blacklistedRoutes: ['comfash.local:9999/api/v01/auth']
      }
    }),
    PopoverModule,
    InfiniteScrollModule,
    SimpleNotificationsModule.forRoot(),
    Ng2GoogleChartsModule
    
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig }, 
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ConfigService,
    UtilService,
    ApiService, 
    NotificationService,
    AuthGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent], 
  entryComponents: [
    CommentDialogComponent, 
    AddCollectionComponent,

    ActivityComponentVote,
    ActivityComponentComment, 
    ActivityComponentFollows, 
    UnknownDynamicComponent
  ]
})
export class AppModule { }

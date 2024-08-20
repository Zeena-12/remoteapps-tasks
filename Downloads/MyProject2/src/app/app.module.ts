import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgOtpInputModule } from  'ng-otp-input';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';






export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [AppComponent],
  imports: [IonicStorageModule.forRoot(),CommonModule,BrowserModule, IonicModule.forRoot(),NgOtpInputModule, AppRoutingModule , HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    NgxSkeletonLoaderModule,
    
    NgxSkeletonLoaderModule.forRoot({
      animation: 'pulse',
      loadingText: 'This item is actually loading...',
    }),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },ScreenOrientation,HTTP,NativeStorage,InAppBrowser,File,FilePath ,WebView,PhotoViewer],
  exports: [TranslateModule, ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AppModule {}

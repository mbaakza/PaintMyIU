import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorApiService } from './services/color-api.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AboutComponent } from './about/about.component';
import { GetDataComponent } from './get-data/get-data.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full'},
  { path: 'home',     component: ColorPickerComponent},
  { path: 'about', component: AboutComponent},
  { path: 'get-data', component: GetDataComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    AboutComponent,
    GetDataComponent,
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    NgxWebstorageModule.forRoot(),
    DragDropModule,
		//NgxWebstorageModule.forRoot({ prefix: 'custom', separator: '.', caseSensitive:true }) 
		// The forRoot method allows to configure the prefix, the separator and the caseSensitive option used by the library
		// Default values:
		// prefix: "ngx-webstorage"
		// separator: "|"
		// caseSensitive: false
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [ColorApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

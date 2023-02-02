import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { OpenApiModule } from './share/modules/open-api.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './share/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    OpenApiModule,
    SharedModule,
    FlexLayoutModule,
    LayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

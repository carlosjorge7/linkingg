import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicPageRoutingModule } from './public-routing.module';

import { PublicPage } from './public.page';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PublicPageRoutingModule],
  declarations: [PublicPage, RegisterComponent, LoginComponent],
})
export class PublicPageModule {}

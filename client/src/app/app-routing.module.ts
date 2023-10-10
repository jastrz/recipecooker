import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './account/login/login.component';

const routes: Routes = [
  { path: 'cook', loadChildren: () => import('./cooker/cooker.module').then(m => m.CookerModule)},
  { path: 'about', component: AboutComponent},
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

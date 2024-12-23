//app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard} from 'src/app/guards/auth.guard';
import { noAuthGuard} from 'src/app/guards/no-auth.guard';
import { authAdminGuard } from 'src/app/guards/auth-admin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [noAuthGuard], // Agregamos el guard

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    canActivate: [noAuthGuard], // Protegemos la pantalla de registro
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./pages/forgotpassword/forgotpassword.module').then( m => m.ForgotpasswordPageModule),
    canActivate: [noAuthGuard], // Protegemos la pantalla de recuperación de contraseña
  },
  {
    path: 'loginscreen',
    loadChildren: () => import('./pages/loginscreen/loginscreen.module').then( m => m.LoginscreenPageModule),
    canActivate: [noAuthGuard], // Protegemos la pantalla de registro
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadChildren: () => import('./pages/favorites/favorites.module').then( m => m.FavoritesPageModule)
  },
  {
    path: 'product-detail/:id', // Ruta con parámetro `id`
    loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule),
  },
  {
    path: 'subitem-detail/:id',
    loadChildren: () => import('./pages/subitem-detail/subitem-detail.module').then(m => m.SubitemDetailPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [authAdminGuard], // Usamos la función en vez de una clase
  },
  {
    path: 'subitems',
    loadChildren: () => import('./pages/subitems/subitems.module').then( m => m.SubitemsPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

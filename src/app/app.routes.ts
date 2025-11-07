import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { ProfileComponent } from './features/profile/profile.component';
import { authGuard } from './core/guards/auth.guard';
import { isloggedGuard } from './core/guards/islogged.guard';


export const routes: Routes = [
{
    path:"",redirectTo:'timeLine',pathMatch:"full"
}
,
{
    path:"" ,component:AuthLayoutComponent,canActivate: [isloggedGuard] ,children:[
        { path:"login",loadComponent:()=>import('../app/features/auth/login/login.component').then((res)=>res.LoginComponent),title:"login" },
        { path:"register",loadComponent:()=>import('../app/features/auth/register/register.component').then((res)=>res.RegisterComponent),title:"register" },
    ]
},

{
    path:"",component:MainLayoutComponent,canActivate: [authGuard],children:[
        { path:"timeLine",loadComponent:()=>import('../app/features/timeline/timeline.component').then((res)=>res.TimelineComponent),title:"timeLine" },
        { path:"profile",component:ProfileComponent,title:"profile" },
        { path:"details/:id",loadComponent:()=>import('../app/features/details-post/details-post.component').then((res)=>res.DetailsPostComponent),title:"post details" },
        { path:"changePassword",loadComponent:()=>import('../app/features/auth/change-password/change-password.component').then((res)=>res.ChangePasswordComponent),title:"changePassword" },
    ]
},
{
    path:"**",canActivate: [authGuard],loadComponent:()=>import('../app/features/not-found/not-found.component').then((res)=>res.NotFoundComponent),title:"notFound"
}

];

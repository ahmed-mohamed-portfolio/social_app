import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { TimelineComponent } from './features/timeline/timeline.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DetailsPostComponent } from './features/details-post/details-post.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
{
    path:"",redirectTo:'timeLine',pathMatch:"full"
}
,
{
    path:"" ,component:AuthLayoutComponent,children:[
        { path:"login",component:LoginComponent,title:"login" },
        { path:"register",component:RegisterComponent,title:"register" },
    ]
},

{
    path:"",component:MainLayoutComponent,children:[
        { path:"timeLine",component:TimelineComponent,title:"timeLine" },
        { path:"profile",component:ProfileComponent,title:"profile" },
        { path:"details/:id",component:DetailsPostComponent,title:"post details" },
        { path:"changePassword",component:ChangePasswordComponent,title:"changePassword" },
    ]
},
{
    path:"**",component:NotFoundComponent,title:"notFound"
}

];

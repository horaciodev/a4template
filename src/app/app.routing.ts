import { Routes, RouterModule } from '@angular/router';


import { AboutComponent } from './about/';
import { WelcomeComponent } from './welcome/';

import { ContactComponent } from './contact/';

import { UnauthorizedComponent } from './unauthorized/';
import { AuthService } from './shared/services/auth.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

const appRoutes: Routes = [
    {
        path: 'welcome',
        component: WelcomeComponent,
    },
    {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    {
        path: 'contact',
        component: ContactComponent,  //Protected resource
        canActivate:[AuthGuardService]
    }

];
export const authProviders = [
    AuthGuardService,
    AuthService
];

export const routing = RouterModule.forRoot(appRoutes);

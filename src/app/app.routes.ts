import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { RegisterCoach } from './pages/register-coach/register-coach';

export const routes: Routes = [
    {path: 'login', component: Register},
    { path: 'registro', component: RegisterCoach }
];

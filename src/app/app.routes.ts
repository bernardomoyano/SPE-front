import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { RegisterCoach } from './pages/register-coach/register-coach';
import { DashboardCoach } from './pages/dashboard-coach/dashboard-coach';
import { MainLayout } from './shared/layout/main-layout/main-layout';

export const routes: Routes = [
    // Rutas públicas (sin layout)
    { path: 'login', component: Register },
    { path: 'registro', component: RegisterCoach },
    
    // Rutas protegidas (con layout)
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'dashboard-coach', component: DashboardCoach },
            // Aquí irán las demás rutas protegidas
            { path: '', redirectTo: 'dashboard-coach', pathMatch: 'full' }
        ]
    }
];

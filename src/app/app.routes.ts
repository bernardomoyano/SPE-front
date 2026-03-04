import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { RegisterCoach } from './pages/register-coach/register-coach';
import { DashboardCoach } from './pages/dashboard-coach/dashboard-coach';
import { MyExercises } from './pages/my-exercises/my-exercises';
import { MyStudents } from './pages/my-students/my-students';
import { Planifications } from './pages/planifications/planifications';
import { DetailsPlanifications } from './pages/details-planifications/details-planifications';
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
            { path: 'ejercicios', component: MyExercises },
            { path: 'atletas', component: MyStudents },
            { path: 'atletas/planificaciones/:id', component: Planifications },
            { path: 'atletas/planificaciones/:id/detalles', component: DetailsPlanifications },
            // Aquí irán las demás rutas protegidas
            { path: '', redirectTo: 'dashboard-coach', pathMatch: 'full' }
        ]
    }
];

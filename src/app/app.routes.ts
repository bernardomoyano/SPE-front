import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { RegisterCoach } from './pages/register-coach/register-coach';
import { DashboardCoach } from './pages/dashboard-coach/dashboard-coach';
import { MyExercises } from './pages/my-exercises/my-exercises';
import { MyStudents } from './pages/my-students/my-students';
import { Planifications } from './pages/planifications/planifications';
import { DetailsPlanifications } from './pages/details-planifications/details-planifications';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { PendingPayments } from './pages/pending-payments/pending-payments';
import { Payments } from './pages/payments/payments';
import { PaymentDocument } from './pages/payment-document/payment-document';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';

export const routes: Routes = [
    // Rutas públicas (sin layout)
    { path: 'login', component: Register },
    { path: 'registro', component: RegisterCoach },
    { path: 'auth/callback', component: AuthCallbackComponent },
    { path: 'comprobantes/mercado-pago/:paymentId', component: PaymentDocument },
    
    // Rutas protegidas (con layout)
    {
        path: '',
        component: MainLayout,
        children: [
            { path: 'dashboard-coach', component: DashboardCoach },
            { path: 'ejercicios', component: MyExercises },
            { path: 'pagos-pendientes', component: PendingPayments },
            { path: 'pagos/:paymentId/comprobante', component: PaymentDocument },
            { path: 'pagos', component: Payments },
            {
                path: 'plantillas-entrenamiento',
                loadComponent: () => import('./pages/training-templates/training-templates')
                    .then(m => m.TrainingTemplates)
            },
            { path: 'atletas', component: MyStudents },
            { path: 'atletas/planificaciones/:id', component: Planifications },
            { path: 'atletas/planificaciones/:id/detalles', component: DetailsPlanifications },
            { path: 'mis-planificaciones', component: Planifications },
            { path: 'mis-planificaciones/detalles', component: DetailsPlanifications },
            // Aquí irán las demás rutas protegidas
            { path: '', redirectTo: 'dashboard-coach', pathMatch: 'full' }
        ]
    }
];

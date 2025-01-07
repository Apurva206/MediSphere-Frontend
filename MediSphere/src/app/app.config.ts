import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from '../home/home.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { authGuard } from './Guard/auth.guard';
import { DoctorDashboardComponent } from '../Dashboard/doctor-dashboard/doctor-dashboard.component';
import { PatientDashboardComponent } from '../Dashboard/patient-dashboard/patient-dashboard.component';
import { PatientAppointmentComponent } from '../Dashboard/patient-appointment/patient-appointment.component';
import { PatientRecordComponent } from '../Dashboard/patient-record/patient-record.component';
import { PatientPrescriptionComponent } from '../Dashboard/patient-prescription/patient-prescription.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password/forgot-password.component';
import { PatientBookAppointmentComponent } from '../Dashboard/patient-book-appointment/patient-book-appointment.component';

const routes : Routes =[
  {
    path: 'app-register',
    component: RegisterComponent
  },
  {
    path: 'app-login',
    component: LoginComponent
  },
  {
    path: 'app-forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path:'app-patient-dashboard',
    component: PatientDashboardComponent,
    canActivate:[authGuard]
  },
  { path: 'app-patient-appointment', 
    component: PatientAppointmentComponent,
    canActivate:[authGuard]
   },
   { path: 'app-patient-book-appointment', 
    component: PatientBookAppointmentComponent,
    canActivate:[authGuard]
   },
  { path: 'app-patient-record',
     component: PatientRecordComponent,
     canActivate:[authGuard]
 },
  { path: 'app-patient-prescription', 
    component: PatientPrescriptionComponent,
    canActivate:[authGuard]
 },
  {
    path:'app-doctor-dashboard',
    component: DoctorDashboardComponent,
    canActivate:[authGuard]
  },
  

  {
    path: 'app-header',
    component: HeaderComponent,
    children:[
      {
        path:'app-patient-dashboard',
        component: PatientDashboardComponent,
        canActivate:[authGuard]
      },
      {
        path:'app-doctor-dashboard',
        component: DoctorDashboardComponent,
        canActivate:[authGuard]
      }
    ]
  },
  {
    path: 'app-home',
    component: HomeComponent,
  },
  { path: '', redirectTo: 'app-home', pathMatch: 'full' }
]

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};

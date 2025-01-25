import { Component, OnInit } from '@angular/core';
import { DoctorAppointmentServiceService } from '../../Services/doctor-appointment-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-doctor-appointment',
  imports: [CommonModule,FormsModule],
  templateUrl: './doctor-appointment.component.html',
  styleUrl: './doctor-appointment.component.css'
})
export class DoctorAppointmentComponent implements OnInit{

  appointments: any[] = [];
  role: string = '';

  constructor(private appointmentService: DoctorAppointmentServiceService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const decoded = jwtDecode<{ [key: string]: any }>(token);
            this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
            const userId = parseInt(decoded["UserId"], 10); // Extract 'UserId' from the token
            this.loadAppointments();
            } catch (error) {
            console.error('Error decoding token:', error);
          }
        } else {
          console.error('Authentication token is missing.');
        }
    
  }

  loadAppointments(): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data.filter((appt) => appt.IsDeleted === 0); // Exclude deleted appointments
      },
      (error) => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  markCompleted(appointmentId: number): void {
    const updateData = { Status: 'completed' };
    this.appointmentService.updateAppointment(appointmentId, updateData).subscribe(
      () => {
        alert('Appointment marked as completed.');
        this.loadAppointments(); // Refresh the list
      },
      (error) => {
        console.error('Error updating appointment', error);
      }
    );
  }

}

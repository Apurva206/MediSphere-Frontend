import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  appointmentId: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  status: string;
  symptoms: string;
  consultationNotes: string;
  isDeleted: boolean;
  showNotes?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7159/api/Appointments'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
    if (!token) {
      throw new Error('No authorization token found.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Include token in the Authorization header
    });
  }

  // Get all appointments
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Update appointment status
  updateAppointmentStatus(appointmentId: number, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${appointmentId}`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  updateAppointment(appointmentId: number,appointment: any): Observable<any> {
    const url = `${this.apiUrl}/${appointmentId}`; // Endpoint to update the appointment
    return this.http.put(url, appointment, { headers: this.getHeaders() });
  }
  // Delete (cancel) an appointment
  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${appointmentId}`, { headers: this.getHeaders() });
  }

  // Get doctor's appointments for the day
  getAppointmentsForDoctor(doctorId: number, date: string): Observable<Appointment[]> {
    return new Observable((observer) => {
      this.getAppointments().subscribe({
        next: (appointments) => {
          const filteredAppointments = appointments.filter(
            (appt) =>
              appt.doctorId === doctorId &&
              new Date(appt.appointmentDate).toDateString() === new Date(date).toDateString() &&
              !appt.isDeleted
          );
          observer.next(filteredAppointments);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }

  getAppointmentsByDoctorID(doctorId: number): Observable<Appointment[]> {
    return new Observable((observer) => {
      this.getAppointments().subscribe({
        next: (appointments) => {
          const filteredAppointments = appointments.filter(
            (appt) =>
              appt.doctorId === doctorId
          );
          observer.next(filteredAppointments);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }
}

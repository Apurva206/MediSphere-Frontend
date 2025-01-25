import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorAppointmentServiceService {
  private apiUrl = 'https://localhost:7159/api/Appointments'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all appointments
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Update appointment status
  updateAppointment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}

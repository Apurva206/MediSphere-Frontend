import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface MedicalReport {
  recordId?: number;
  patientId: number;
  doctorId: number;
  appointmentId: number;
  symptoms: string;
  consultationDate: string;
  treatmentPlan: string;
  prescribedTests?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://localhost:7159/api/MedicalRecords';

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

  // ✅ Fetch Medical Record by Appointment
  fetchMedicalRecordByAppointment(appointmentId: number): Observable<MedicalReport | undefined> {
    const headers = this.getHeaders();
  
    return this.http.get<MedicalReport[]>(`${this.apiUrl}`, { headers }).pipe(
      map((records) => {
        // Find and return the report by appointmentId
        return records.find((record) => record.appointmentId === appointmentId);
      })
    );
  }

  // ✅ Get Report by Record ID
  getReportByRecordId(recordId: number): Observable<MedicalReport> {
    return this.http.get<MedicalReport>(`${this.apiUrl}/${recordId}`, { headers: this.getHeaders() });
  }

  // ✅ Add New Medical Report
  addMedicalReport(report: MedicalReport): Observable<MedicalReport> {
    return this.http.post<MedicalReport>(this.apiUrl, report, { headers: this.getHeaders() });
  }

  // ✅ Update Existing Medical Report
  updateMedicalReport(recordId: number, report: MedicalReport): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${recordId}`, report, { headers: this.getHeaders() });
  }
}

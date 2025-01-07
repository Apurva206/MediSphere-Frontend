import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-patient-record',
  imports: [CommonModule],
  templateUrl: './patient-record.component.html',
  styleUrl: './patient-record.component.css'
})
export class PatientRecordComponent {
  medicalRecords: any[] = []; // Array to store medical records
  patientId: number = 0; // Logged-in patient's ID
  role: string = ''; // User role
  UserId: number =0;
  private apiUrl = 'https://localhost:7159/api/MedicalRecords'; // API URL for medical records
  private patientApiUrl = 'https://localhost:7159/api/Patient'; // API URL for patient

  http = inject(HttpClient);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
         this.fetchPatientId(this.UserId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  fetchPatientId(userId: number): void {
    const headers = new HttpHeaders();
    // Fetch the patient data based on userId
    this.http.get<any[]>(`${this.patientApiUrl}`, { headers }).subscribe(
      (patients) => {
        const patient = patients.find(p => p.userId === userId);
        if (patient && patient.patientId) {
          this.patientId = patient.patientId;
          console.log('Patient ID fetched:', this.patientId);
  
          // Now fetch medical records using the fetched patientId
          this.fetchMedicalRecords(this.patientId);
        } else {
          console.error('Patient not found for the given UserId.');
        }
      },
      (error) => {
        console.error('Error fetching patient data:', error);
      }
    );
  }
  
  fetchMedicalRecords(patientId: number): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Authentication token is missing.');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    // Fetch medical records using patientId for the logged-in patient
    this.http.get<any[]>(`${this.apiUrl}/${patientId}`, { headers }).subscribe(
      (medicalRecords) => {
        console.log('Medical records fetched:', medicalRecords);
        this.medicalRecords = medicalRecords;  // Store the fetched medical records
      },
      (error) => {
        console.error('Error fetching medical records:', error);
      }
    );
  } 
}
// doctor name-appointment
//view app: dwnld pdf, view pres
import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-prescription',
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-prescription.component.html',
  styleUrl: './patient-prescription.component.css'
})
export class PatientPrescriptionComponent {
  prescriptions: any[] = []; // Array to store 
  patientId: number = 0; // Logged-in patient's ID
  doctorId: number = 0;
  role: string = ''; // User role
  UserId: number =0;
  Username: string = '';
  recordId: number = 0;

  symptoms: string = ''; // Symptoms fetched from MedicalRecords
  consultationDate: string = ''; // Consultation Date from MedicalRecords
  treatmentPlan: string = ''; // Treatment plan from MedicalRecords
  prescribedTests: string = ''; // Prescribed tests from MedicalRecords

  private apiUrl = 'https://localhost:7159/api/Prescriptions'; 
  private patientApiUrl = 'https://localhost:7159/api/Patient'; 
  private doctorApiUrl = 'https://localhost:7159/api/Doctor';
  private recordApiUrl = 'https://localhost:7159/api/MedicalRecords';

  http = inject(HttpClient);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.Username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
        //  this.fetchRecordId(this.patientId);
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
          this.fetchRecordId(this.patientId);
        } else {
          console.error('Patient not found for the given UserId.');
        }
      },
      (error) => {
        console.error('Error fetching patient data:', error);
      }
    );
  }
  fetchRecordId(patientId: number): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Fetch the patient data based on userId
    this.http.get<any[]>(`${this.recordApiUrl}`, { headers }).subscribe(
      (records) => {
        const record = records.find(r => r.patientId === patientId);
        if (record && record.recordId) {
          this.recordId = record.recordId;
          console.log('Record ID fetched:', this.recordId);

          // Fetch additional details from the medical record
          this.symptoms = record.Symptoms || '';
          this.consultationDate = record.ConsultationDate || '';
          this.treatmentPlan = record.TreatmentPlan || '';
          this.prescribedTests = record.PrescribedTests || '';

          this.fetchDoctorDetails(record.doctorId, record);
          // Now fetch medical records using the fetched patientId
          this.fetchPrescriptions(this.recordId);
        } else {
          console.error('prescription not found for the given recordId.');
        }
      },
      (error) => {
        console.error('Error fetching prescription:', error);
      }
    );
  }
  
  fetchPrescriptions(recordId: number): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.apiUrl}`, { headers }). subscribe(
      (prescriptions) => {
        this.prescriptions = prescriptions.filter(
          (prescriptions) => prescriptions.recordId === recordId
        );
        // this.prescriptions.forEach((prescriptions) => {
        //   this.fetchDoctorDetails(prescriptions.doctorId, prescriptions); // Fetch doctor info by doctorId
        // });
        console.log("Prescription fetched successfully:", this.prescriptions +"recordId:",this.recordId);
      },
      (error)=>{
        console.error('error fetching prescription:',error);
      }
    );
  } 

  viewPrescription(recordId: number): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.apiUrl}`, { headers }).subscribe(
      (prescriptions) => {
        this.prescriptions = prescriptions.filter(p => p.recordId === recordId);
        console.log("Prescription fetched successfully:", this.prescriptions);
      },
      (error) => {
        console.error('Error fetching prescription:', error);
      }
    );
  } 

  fetchDoctorDetails(doctorId: number, prescriptions: any): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Fetch doctor details by doctor ID
    this.http.get<any>(`${this.doctorApiUrl}/${doctorId}`, { headers }).subscribe(
      (doctor) => {
        if (doctor) {
          prescriptions.doctorName = doctor.fullName; // Add doctor name to the appointment
          prescriptions.doctorSpecialty = doctor.specialty; // Add doctor specialty to the appointment
          console.log('Doctor details fetched for appointment:', doctor);
        } else {
          console.error(`Doctor with ID ${doctorId} not found.`);
        }
      },
      (error) => {
        console.error('Error fetching doctor details:', error);
      }
    );
  }
  navigateToDashboard(): void {
    this.router.navigate(['/app-patient-dashboard']); // Replace with your actual route
  }
}


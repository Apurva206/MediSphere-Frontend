import { Component,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-book-appointment',
  imports: [FormsModule, CommonModule],
  templateUrl: './patient-book-appointment.component.html',
  styleUrl: './patient-book-appointment.component.css'
})
export class PatientBookAppointmentComponent {
  appointment = {
    appointmentDate: '',
    status: '',
    symptoms: '',
    consultationNotes: '',
    doctorId: ''  // doctorId received from the user selection in the form
  };

  role: string = '';
  UserId: number =0;
  patientId: number = 0;


  // Specialties and doctor ID
  specialty: string[] = [];
  selectedSpecialty: string = '';
  doctors: any[] = [];
  selectedDoctorId: string = '';

  private apiUrl = 'https://localhost:7159/api/Appointments'; // Replace with your actual API URL
  private doctorApiUrl = 'https://localhost:7159/api/Doctor';

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
    
    // Load specialties on component initialization
    this.fetchSpecialties();
  } 
  fetchSpecialties(): void {
    this.http.get<any[]>(`${this.doctorApiUrl}`).subscribe(
      (doctors) => {
        console.log('Doctors fetched:', doctors); // Log the API response
        if (doctors && Array.isArray(doctors)) {
          // Ensure each doctor has a 'specialty' property
          const specialties = doctors
            .filter(doctor => doctor.specialty) // Filter out doctors without specialties
            .map(doctor => doctor.specialty);
          this.specialty = [...new Set(specialties)]; // Use Set to get distinct specialties
          console.log('Extracted specialties:', this.specialty); // Log the extracted specialties
        } else {
          console.error('Unexpected API response structure:', doctors);
        }
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  onSpecialtyChange(): void {
    // When a specialty is selected, fetch doctors with that specialty
    this.fetchDoctorIdBySpecialty(this.selectedSpecialty);
  }

  fetchDoctorIdBySpecialty(specialty: string): void {
    // Fetch doctor(s) based on the selected specialty
    this.http.get<any[]>(`${this.doctorApiUrl}?specialty=${specialty}`).subscribe(
      (doctors) => {
        console.log('Doctors for selected specialty:', doctors);
        if (doctors && Array.isArray(doctors) && doctors.length > 0) {
          // Find the doctor corresponding to the selected specialty
          const selectedDoctor = doctors.find(doctor => doctor.specialty === specialty);
          if (selectedDoctor) {
            this.appointment.doctorId = selectedDoctor.doctorId;
            console.log('Doctor ID set to:', this.appointment.doctorId);
          } else {
            console.error('No doctor found for this specialty');
            this.appointment.doctorId = '';  // Reset doctor ID if no doctor is found
          }
        } else {
          console.error('No doctors found for this specialty');
          this.appointment.doctorId = '';  // Reset doctor ID if no doctors are found
        }
      },
      (error) => {
        console.error('Error fetching doctors by specialty:', error);
      }
    );
  }

  fetchPatientId(userId: number): void {
  const patientApiUrl = `https://localhost:7159/api/Patient`;
  this.http.get<any[]>(patientApiUrl).subscribe(
    (patients) => {
      const patient = patients.find(p => p.userId === userId);
      if (patient && patient.patientId) {
        this.patientId = patient.patientId;
        console.log('Patient ID fetched:', this.patientId);
      } else {
        console.error('Patient not found for the given UserId.');
      }
    },
    (error) => {
      console.error('Error fetching patients:', error);
    }
  );
}


  // Handle form submission
  onSubmit() {
    if (!this.UserId) {
      console.error('User ID is not found');
      return;
    }

    if (this.role === 'Patient') {
      const appointmentData = {
        ...this.appointment,
        patientId: this.patientId,  // Attach patientId from the decoded token
        doctorId: this.appointment.doctorId,  // The doctorId selected by the patient
      };

      // Call the backend API to submit the appointment data
    const token = localStorage.getItem('authToken');  // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(this.apiUrl, appointmentData, { headers }).subscribe(
        (response:any) => {
          console.log('Appointment successfully created!', response);
          alert('Appointment added successfully!');
          this.router.navigate(['/app-patient-appointment']);  // Redirect after successful submission

        },
        (error) => {
          console.error('Error creating appointment:', error);
        }
      );
    } else {
      console.error('Only patients can create appointments');
    }
  }
}

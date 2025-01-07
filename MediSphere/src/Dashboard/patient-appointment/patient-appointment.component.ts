import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-appointment',
  imports: [CommonModule],
  templateUrl: './patient-appointment.component.html',
  styleUrl: './patient-appointment.component.css'
})
export class PatientAppointmentComponent {
  appointments: any[] = []; // Array to store fetched appointments
  doctors: any[] = [];
  patientId: number = 0; // Logged-in patient's ID
  role: string = ''; // User role
  specialty: string[] = [];
  selectedSpecialty: string = '';
  private apiUrl = 'https://localhost:7159/api/Appointments'; // API URL for appointments
  private patientApiUrl = 'https://localhost:7159/api/Patient'; // API URL for patients
  private doctorApiUrl = 'https://localhost:7159/api/Doctor'; 

  http = inject(HttpClient);

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        const userId = parseInt(decoded["UserId"], 10); // Extract 'UserId' from the token
        this.fetchPatientId(userId);
        //this.fetchSpecialties();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('Authentication token is missing.');
    }
  }
  // fetchSpecialties(): void {
  //   this.http.get<any[]>(this.doctorApiUrl).subscribe(
  //     (doctors) => {
  //       console.log('Doctors fetched:', doctors); // Log the API response
  //       if (doctors && Array.isArray(doctors)) {
  //         // Ensure each doctor has a 'specialty' property
  //         const specialties = doctors
  //           .filter(doctor => doctor.specialty) // Filter out doctors without specialties
  //           .map(doctor => doctor.specialty);
  //         this.specialty = [...new Set(specialties)]; // Use Set to get distinct specialties
  //         console.log('Extracted specialties:', this.specialty); // Log the extracted specialties
  //       } else {
  //         console.error('Unexpected API response structure:', doctors);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching doctors:', error);
  //     }
  //   );
  // }

  fetchPatientId(userId: number): void {
    const headers = new HttpHeaders();
    this.http.get<any[]>(this.patientApiUrl, { headers }).subscribe(
      (patients) => {
        const patient = patients.find(p => p.userId === userId);
        if (patient && patient.patientId) {
          this.patientId = patient.patientId;
          console.log('Patient ID fetched:', this.patientId);
          this.fetchAppointments(this.patientId);
        } else {
          console.error('Patient not found for the given UserId.');
        }
      },
      (error) => {
        console.error('Error fetching patient data:', error);
      }
    );
  }

  fetchAppointments(patientId: number): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Fetch all appointments and filter based on patient ID and selected specialty
    this.http.get<any[]>(`${this.apiUrl}`, { headers }).subscribe(
      (appointments) => {
        this.appointments = appointments.filter(
          (appointment) => appointment.patientId === patientId
        );

        // Fetch doctor details for each appointment
        this.appointments.forEach((appointment) => {
          this.fetchDoctorDetails(appointment.doctorId, appointment); // Fetch doctor info by doctorId
        });
        console.log('Appointments fetched successfully:', this.appointments);
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
// Fetch doctor details based on the doctor ID
fetchDoctorDetails(doctorId: number, appointment: any): void {
  const token = localStorage.getItem('authToken'); // Retrieve the token
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Fetch doctor details by doctor ID
  this.http.get<any>(`${this.doctorApiUrl}/${doctorId}`, { headers }).subscribe(
    (doctor) => {
      if (doctor) {
        appointment.doctorName = doctor.name; // Add doctor name to the appointment
        appointment.doctorSpecialty = doctor.specialty; // Add doctor specialty to the appointment
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
  cancelAppointment(appointmentId: number): void {
    const confirmation = confirm('Are you sure you want to cancel this appointment?');
    if (confirmation) {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      // Assuming the API allows updating an appointment's status to "Cancelled"
      this.http.delete(`https://localhost:7159/api/Appointments/${appointmentId}`, { headers }).subscribe(
        () => {
          this.appointments = this.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
          console.log('Appointment cancelled successfully.');
        },
        (error) => {
          console.error('Error cancelling appointment:', error);
        }
      );
    }
  }
}

import { Component,inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute  } from '@angular/router';
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
    appointmentId: '', // Add appointmentId for editing purposes
    appointmentDate: '',
    status: 'scheduled',
    symptoms: '',
    consultationNotes: '',
    doctorId: '',  // doctorId received from the user selection in the form
    slot: ''
  };

  role: string = '';
  UserId: number =0;
  patientId: number = 0;


  // Specialties and doctor ID
  specialty: string[] = [];
  selectedSpecialty: string = '';
  doctors: any[] = [];
  selectedDoctorId: string = '';

  // Predefined slots
  allSlots: string[] = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
  ];
  availableSlots: string[] = [];
  appointments: any[] = [];

  private apiUrl = 'https://localhost:7159/api/Appointments'; // Replace with your actual API URL
  private doctorApiUrl = 'https://localhost:7159/api/Doctor';

  http = inject(HttpClient);

  constructor(private router: Router, private route: ActivatedRoute) {}

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
    // Check if editing an appointment
    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params); // Debugging
      if (params['appointmentId']) {
        this.loadAppointment(params['appointmentId']);
      }
    });
    // Load specialties on component initialization
    this.fetchSpecialties();
    this.fetchAppointments();
  } 
  
  loadAppointment(appointmentId: string): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    if (!token) {
      console.error('Authorization token is missing. Redirecting to login.');
      alert('Session expired. Please log in again.');
      this.router.navigate(['/login']); // Redirect to login if token is missing
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Token being sent:', token); // Debugging token
  
    this.http.get<any>(`${this.apiUrl}/${appointmentId}`, { headers }).subscribe(
      (appointment) => {
        console.log('API Response for appointment:', appointment); // Debugging API response
        this.appointment = {
          appointmentId: appointment.appointmentId,
          appointmentDate: appointment.appointmentDate,
          status: appointment.status,
          symptoms: appointment.symptoms,
          consultationNotes: appointment.consultationNotes,
          doctorId: appointment.doctorId,
          slot: appointment.slot,
        };
        this.selectedSpecialty = appointment.specialty; // Populate selected specialty
        this.selectedDoctorId = appointment.doctorId; // Populate selected doctorId
        this.filterAvailableSlots(); // Load available slots for editing
      },
      (error) => {
        console.error('Error loading appointment:', error); // Debugging API error
        if (error.status === 401) {
          console.error('Unauthorized access. Possible token issue.');
          alert('Session expired or unauthorized access. Please log in again.');
          this.router.navigate(['/login']); // Redirect to login on unauthorized
        } else {
          alert('Error loading the appointment. Please try again later.');
        }
      }
    );
  }
  
  fetchSpecialties(): void {
    this.http.get<any[]>(`${this.doctorApiUrl}`).subscribe(
      (doctors) => {
        this.specialty = [...new Set(doctors.map(doctor => doctor.specialty))];
      },
      (error) => {
        console.error('Error fetching specialties:', error);
      }
    );
  }

  onSpecialtyChange(): void {
    this.http.get<any[]>(`${this.doctorApiUrl}?specialty=${this.selectedSpecialty}`).subscribe(
      (doctors) => {
        this.doctors = doctors.filter(doctor => doctor.specialty === this.selectedSpecialty);
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
  onDoctorChange(): void {
    console.log('Selected Doctor ID:', this.selectedDoctorId); // Debugging
    if (this.selectedDoctorId) {
      this.filterAvailableSlots();
    }
  }
  
  filterAvailableSlots(): void {
    console.log('Filtering slots for doctor ID:', this.selectedDoctorId); // Debugging
    const bookedSlots = this.appointments
      .filter((appointment) => appointment.doctorId === this.selectedDoctorId)
      .map((appointment) => appointment.slot);
  
    console.log('Booked Slots:', bookedSlots); // Debugging
    this.availableSlots = this.allSlots.filter((slot) => !bookedSlots.includes(slot));
    console.log('Available Slots:', this.availableSlots); // Debugging
  }
  

  fetchAppointments(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(this.apiUrl, {headers}).subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.filterAvailableSlots();
      },
      (error) => {
        console.error('Error fetching appointments:', error);
      }
    );
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
  // onSubmit() {
  //   if (!this.UserId) {
  //     console.error('User ID is not found');
  //     return;
  //   }

  //   if (this.role === 'Patient') {
  //     const appointmentData = {
  //       ...this.appointment,
  //       patientId: this.patientId,  // Attach patientId from the decoded token
  //       doctorId: this.appointment.doctorId,  // The doctorId selected by the patient
  //     };

  //     // Call the backend API to submit the appointment data
  //   const token = localStorage.getItem('authToken');  // Retrieve the token
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //     this.http.post(this.apiUrl, appointmentData, { headers }).subscribe(
  //       (response:any) => {
  //         console.log('Appointment successfully created!', response);
  //         alert('Appointment added successfully!');
  //         this.router.navigate(['/app-patient-appointment']);  // Redirect after successful submission

  //       },
  //       (error) => {
  //         console.error('Error creating appointment:', error);
  //       }
  //     );
  //   } else {
  //     console.error('Only patients can create appointments');
  //   }
  // }
  onSubmit() {
    if (!this.UserId) {
      console.error('User ID is not found');
      return;
    }

    if (this.role === 'Patient') {
      const appointmentData = {
        ...this.appointment,
        patientId: this.patientId,
        doctorId: this.selectedDoctorId, // Use the selected doctorId
      };

      const token = localStorage.getItem('authToken'); // Retrieve the token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      if (this.appointment.appointmentId) {
        // Editing existing appointment
        this.http.put(`${this.apiUrl}/${this.appointment.appointmentId}`, appointmentData, { headers }).subscribe(
          (response: any) => {
            console.log('Appointment successfully updated!', response);
            alert('Appointment updated successfully!');
            this.router.navigate(['/app-patient-appointment']); // Redirect after successful update
          },
          (error) => {
            console.error('Error updating appointment:', error);
          }
        );
      } else {
        // Creating new appointment
        this.http.post(this.apiUrl, appointmentData, { headers }).subscribe(
          (response: any) => {
            console.log('Appointment successfully created!', response);
            alert('Appointment added successfully!');
            this.router.navigate(['/app-patient-appointment']); // Redirect after successful submission
          },
          (error) => {
            console.error('Error creating appointment:', error);
          }
        );
      }
    } else {
      console.error('Only patients can create or edit appointments');
    }
  }
  navigateToDashboard(): void {
    this.router.navigate(['/app-patient-dashboard']); // Replace with your actual route
  }
}

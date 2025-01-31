import { Component, OnInit } from '@angular/core';
// import { DoctorAppointmentServiceService } from '../../Services/doctor-appointment-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Appointment, AppointmentService } from '../../Services/doctor-appointment-service.service';
@Component({
  selector: 'app-doctor-appointment',
  imports: [CommonModule,FormsModule],
  templateUrl: './doctor-appointment.component.html',
  styleUrl: './doctor-appointment.component.css'
})
export class DoctorAppointmentComponent implements OnInit{

  appointments: Appointment[] = [];
  isLoading = true;
  error: string | null = null;
  doctorId: number | null = null;
  UserId: any;
  private doctorApiUrl = 'https://localhost:7159/api/Doctor'; // Your Doctor API URL


  constructor(private appointmentService: AppointmentService , private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.getDoctorIdFromToken();
    this.fetchAppointmentsForToday();
    this.getAppointments();

  }

  getDoctorIdFromToken(): void {
    const token = localStorage.getItem('authToken');
    console.log(token);
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.UserId = decodedToken?.UserId || null;
      console.log(this.UserId);
      this.fetchDoctorId(this.UserId);

    }
  }

  fetchDoctorId(userId: number): void {
    const headers = new HttpHeaders();
    this.http.get<any[]>(this.doctorApiUrl, { headers }).subscribe(
      (doctors) => {
        console.log('Doctor Data:', doctors);  // Log the entire response
        const doctor = doctors.find(d => d.userId == userId);
        console.log('Found Doctor:', doctor);  // Log the found doctor
  
        if (doctor && doctor.doctorId) {
          this.doctorId = doctor.doctorId;
          console.log('Doctor ID fetched:', this.doctorId);
          this.getAppointments();  // Proceed to fetch appointments
        } else {
          console.error('Doctor not found for the given UserId.');
        }
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
      }
    );
  }
 
  fetchAppointmentsForToday(): void {
    if (this.doctorId) {
      const today = new Date().toISOString();
      this.appointmentService.getAppointmentsForDoctor(this.doctorId, today).subscribe({
        next: (data) => {
          this.appointments = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch appointments.';
          this.isLoading = false;
        },
      });
    } 
  }

  updateAppointmentStatus(event: any, appointment: any): void {
    const newStatus = event.target.value;
    appointment.status = newStatus;
  
    if (newStatus === 'completed') {
      // Allow editing consultation notes
      appointment.editable = true;
    } else {
      // Disable editing and clear notes if not completed
      appointment.editable = false;
      appointment.consultationNotes = '';
    }
  }
  saveAppointment(appointment: any): void {
    if (appointment.status === 'completed') {
      // Call a service to save the updated appointment
      this.appointmentService.updateAppointment(appointment.appointmentId, appointment).subscribe({
        next: () => alert('Appointment updated successfully!'),
        error: () => alert('Failed to update appointment.'),
      });
    }
  }
  toggleNotes(appointment: Appointment): void {
    (appointment as any).showNotes = !(appointment as any).showNotes;
  }
  
  cancelAppointment(appointment: Appointment): void {
    const confirmDelete = confirm("Are you sure you want to cancel this appointment?");
  if (confirmDelete) {
    this.appointmentService.deleteAppointment(appointment.appointmentId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(
          (appt) => appt.appointmentId !== appointment.appointmentId
        );
        alert('Appointment has been successfully cancelled.');
      },
      error: () => {
        alert('Failed to cancel the appointment. Please try again.');
      },
    });
  } 
}
  onStatusChange(event: Event, appointment: Appointment): void {
    const selectElement = event.target as HTMLSelectElement; // Type casting
    const newStatus = selectElement.value; // Get the selected value
    this.updateAppointmentStatus(appointment, newStatus); // Call updateStatus to handle status update
  }

  getAppointments(): void {
    if (this.doctorId) {
      this.isLoading = true;
      this.error = null;

      this.appointmentService.getAppointmentsByDoctorID(this.doctorId).subscribe({
        next: (data) => {
          this.appointments = data;
          this.isLoading = false;
          console.log(this.appointments);
        },
        error: (err) => {
          this.error = 'Failed to fetch appointments.';
          this.isLoading = false;
        },
      });
    }
  }

  navigateToRecords(appointmentId: number): void {
    this.router.navigate(['/app-doctor-record'], {
      queryParams: { appointmentId: appointmentId }
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {jwtDecode} from 'jwt-decode';
// import { Appointment, AppointmentService } from '../../Services/doctor-appointment-service.service';

// @Component({
//   selector: 'app-doctor-appointment',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './doctor-appointment.component.html',
//   styleUrls: ['./doctor-appointment.component.css']
// })
// export class DoctorAppointmentComponent implements OnInit {
//   appointments: Appointment[] = [];
//   isLoading = true;
//   error: string | null = null;
//   doctorId: number | null = null;
//   UserId: any;
//   private doctorApiUrl = 'https://localhost:7159/api/Doctor'; // Your Doctor API URL

//   constructor(private appointmentService: AppointmentService, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.getDoctorIdFromToken();
//     this.getAppointments(); // Fetch all appointments initially
//   }

//   /**
//    * Decode token to get the user ID and fetch doctor ID
//    */
//   getDoctorIdFromToken(): void {
//     const token = localStorage.getItem('authToken');
//     console.log('Token:', token);
//     if (token) {
//       const decodedToken: any = jwtDecode(token);
//       this.UserId = decodedToken?.UserId || null;
//       console.log('Decoded UserID:', this.UserId);
//       this.fetchDoctorId(this.UserId);
//     }
//   }

//   /**
//    * Fetch doctor ID using the user ID
//    * @param userId - User ID from the token
//    */
//   fetchDoctorId(userId: number): void {
//     const headers = new HttpHeaders();
//     this.http.get<any[]>(this.doctorApiUrl, { headers }).subscribe(
//       (doctors) => {
//         console.log('Doctor Data:', doctors);
//         const doctor = doctors.find(d => d.userId == userId);
//         console.log('Found Doctor:', doctor);

//         if (doctor && doctor.doctorId) {
//           this.doctorId = doctor.doctorId;
//           console.log('Doctor ID fetched:', this.doctorId);
//         } else {
//           console.error('Doctor not found for the given UserId.');
//         }
//       },
//       (error) => {
//         console.error('Error fetching doctor data:', error);
//       }
//     );
//   }

//   /**
//    * Fetch all appointments for the doctor
//    */
//   getAppointments(): void {
//     this.isLoading = true;
//     this.error = null;

//     if (this.doctorId) {
//       this.appointmentService.getAppointmentsForDoctor(this.doctorId, '').subscribe({
//         next: (data) => {
//           this.appointments = data;
//           this.isLoading = false;
//         },
//         error: (err) => {
//           this.error = 'Failed to fetch appointments.';
//           this.isLoading = false;
//         },
//       });
//     }
//   }

//   /**
//    * Fetch today's appointments for the doctor
//    */
//   showTodaysAppointments(): void {
//     if (this.doctorId) {
//       const today = new Date().toISOString();
//       this.isLoading = true;
//       this.error = null;

//       this.appointmentService.getAppointmentsForDoctor(this.doctorId, today).subscribe({
//         next: (data) => {
//           this.appointments = data;
//           this.isLoading = false;
//         },
//         error: (err) => {
//           this.error = 'Failed to fetch today\'s appointments.';
//           this.isLoading = false;
//         },
//       });
//     }
//   }

//   /**
//    * Update the status of an appointment
//    * @param appointment - The appointment to update
//    * @param status - New status to set
//    */
//   updateStatus(appointment: Appointment, status: string): void {
//     if (!appointment || !status) {
//       alert('Invalid status update request.');
//       return;
//     }

//     this.appointmentService.updateAppointmentStatus(appointment.appointmentId, status).subscribe({
//       next: () => {
//         appointment.status = status;
//       },
//       error: () => {
//         alert('Failed to update the status. Please try again.');
//       },
//     });
//   }

//   /**
//    * Cancel an appointment
//    * @param appointment - The appointment to cancel
//    */
//   cancelAppointment(appointment: Appointment): void {
//     this.appointmentService.deleteAppointment(appointment.appointmentId).subscribe({
//       next: () => {
//         this.appointments = this.appointments.filter(
//           (appt) => appt.appointmentId !== appointment.appointmentId
//         );
//       },
//       error: () => {
//         alert('Failed to cancel the appointment. Please try again.');
//       },
//     });
//   }

//   /**
//    * Handle status change from dropdown
//    * @param event - Change event
//    * @param appointment - The appointment to update
//    */
//   onStatusChange(event: Event, appointment: Appointment): void {
//     const selectElement = event.target as HTMLSelectElement;
//     const newStatus = selectElement.value;
//     this.updateStatus(appointment, newStatus);
//   }
// }

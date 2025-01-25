import { Component, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-patient-record',
  imports: [CommonModule],
  templateUrl: './patient-record.component.html',
  styleUrl: './patient-record.component.css'
})
// export class PatientRecordComponent {
//   appointmentId: number = 0;
//   medicalRecord: any = null; // Single medical record based on appointmentId
//   medicalRecords: any[] = []; // Array to store medical records
//   patientId: number = 0; // Logged-in patient's ID
//   doctorId: number = 0;
//   role: string = ''; // User role
//   UserId: number =0;
//   Username: string = '';

//   private apiUrl = 'https://localhost:7159/api/MedicalRecords'; // API URL for medical records
//   private patientApiUrl = 'https://localhost:7159/api/Patient'; // API URL for patient
//   private doctorApiUrl = 'https://localhost:7159/api/Doctor';

//   http = inject(HttpClient);

//   constructor(private route: ActivatedRoute,private router: Router) {}

//   ngOnInit(): void {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode<{ [key: string]: any }>(token);
//         this.Username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
//         this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
//         this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
//         console.log('Decoded Token:', decoded); // Optional: To verify the token structure
//          this.fetchPatientId(this.UserId);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     }
//     this.route.queryParams.subscribe((params) => {
//       this.appointmentId = +params['appointmentId'];
//       if (this.appointmentId) {
//         this.fetchMedicalRecordByAppointment();
//       }
//     });
//   }
  
//   downloadReport(record: any): void {
//     const doc = new jsPDF();
  
//     // Header Section with Colors
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(18);
//     doc.setTextColor(0, 51, 102); // Dark Blue
//     doc.text('Medical Report', 105, 20, { align: 'center' });
  
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(105, 105, 105); // Gray
//     doc.text('MediSphere Hospital', 105, 28, { align: 'center' });
//     doc.text('Address: 123 Wellness Road, Health City | Contact: +1-123-456-7890', 105, 34, { align: 'center' });
  
//     // Line below header
//     doc.setDrawColor(200, 200, 200); // Light Gray
//     doc.line(10, 40, 200, 40);
  
//     // Patient Name in Center
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(0, 0, 0); // Black
//     doc.text(`Patient Name: ${this.Username}`, 105, 50, { align: 'center' });
  
//     // Doctor Details Section with Background
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.setFillColor(230, 230, 250); // Lavender Blue Background
//     doc.rect(10, 60, 190, 10, 'F'); // Draw filled rectangle
//     doc.setTextColor(0, 0, 102); // Dark Blue Text
//     doc.text('Doctor Details', 15, 67);
  
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(0, 0, 0); // Black
//     doc.text(`Doctor Name: ${record.doctorName}`, 10, 80);
//     doc.text(`Specialty: ${record.doctorSpecialty}`, 10, 90);
  
//     // Consultation Details Section with Background
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.setFillColor(230, 230, 250); // Light Green Background
//     doc.rect(10, 100, 190, 10, 'F'); // Draw filled rectangle
//     doc.setTextColor(0, 0, 102); // Dark Green Text
//     doc.text('Consultation Details', 15, 107);
  
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(0, 0, 0); // Black
//     doc.text(`Consultation Date: ${record.consultationDate}`, 10, 120);
//     doc.text(`Symptoms: ${record.symptoms}`, 10, 130);
//     // doc.text(`Diagnosis: ${record.diagnosis || 'N/A'}`, 10, 140);
//     doc.text(`Treatment Plan: ${record.treatmentPlan}`, 10, 140);
//     doc.text(`Prescribed Tests: ${record.prescribedTests || 'N/A'}`, 10, 150);
  
//     // Footer Section with Gray Line
//     doc.setDrawColor(200, 200, 200); // Light Gray Line
//     doc.line(10, 270, 200, 270);
  
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'italic');
//     doc.setTextColor(105, 105, 105); // Gray Text
//     doc.text('This report is generated for medical use only.', 105, 280, { align: 'center' });
//     doc.text('MediSphere © 2025', 105, 285, { align: 'center' });
  
//     // Save PDF
//     doc.save(`Medical_Report_${this.Username}.pdf`);
//   }
  
  
  
//   navigateToPrescription(): void {
//     this.router.navigate(['/app-patient-prescription']); // Replace with your actual route
//   }
//   fetchPatientId(userId: number): void {
//     const headers = new HttpHeaders();
//     // Fetch the patient data based on userId
//     this.http.get<any[]>(`${this.patientApiUrl}`, { headers }).subscribe(
//       (patients) => {
//         const patient = patients.find(p => p.userId === userId);
//         if (patient && patient.patientId) {
//           this.patientId = patient.patientId;
//           console.log('Patient ID fetched:', this.patientId);
  
//           // Now fetch medical records using the fetched patientId
//           this.fetchMedicalRecords(this.patientId);
//         } else {
//           console.error('Patient not found for the given UserId.');
//         }
//       },
//       (error) => {
//         console.error('Error fetching patient data:', error);
//       }
//     );
//   }
  
//   fetchMedicalRecords(patientId: number): void {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any[]>(`${this.apiUrl}`, { headers }). subscribe(
//       (medicalRecords) => {
//         this.medicalRecords = medicalRecords.filter(
//           (medicalRecord) => medicalRecord.patientId === patientId
//         );
//         this.medicalRecords.forEach((medicalRecord) => {
//           this.fetchDoctorDetails(medicalRecord.doctorId, medicalRecord); // Fetch doctor info by doctorId
//         });
//         console.log("Records fetched successfully:", this.medicalRecords);
//       },
//       (error)=>{
//         console.error('error fetching records:',error);
//       }
//     );
//   } 
//   fetchMedicalRecordByAppointment(): void {
//     const token = localStorage.getItem('authToken');
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

//     this.http.get<any[]>(`${this.apiUrl}`, { headers }).subscribe(
//       (records) => {
//         this.medicalRecord = records.find((record) => record.appointmentId === this.appointmentId);
//         if (this.medicalRecord) {
//           this.fetchDoctorDetails(this.medicalRecord.doctorId, this.medicalRecord);
//           console.log('Fetched Medical Record:', this.medicalRecord);
//         } else {
//           console.error('No record found for the given appointment ID.');
//         }
//       },
//       (error) => console.error('Error fetching medical record:', error)
//     );
//   }
  
//   fetchDoctorDetails(doctorId: number, medicalRecords: any): void {
//     const token = localStorage.getItem('authToken'); // Retrieve the token
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
//     // Fetch doctor details by doctor ID
//     this.http.get<any>(`${this.doctorApiUrl}/${doctorId}`, { headers }).subscribe(
//       (doctor) => {
//         if (doctor) {
//           medicalRecords.doctorName = doctor.fullName; // Add doctor name to the appointment
//           medicalRecords.doctorSpecialty = doctor.specialty; // Add doctor specialty to the appointment
//           console.log('Doctor details fetched for appointment:', doctor);
//         } else {
//           console.error(`Doctor with ID ${doctorId} not found.`);
//         }
//       },
//       (error) => {
//         console.error('Error fetching doctor details:', error);
//       }
//     );
//   }
//   navigateToDashboard(): void {
//     this.router.navigate(['/app-patient-dashboard']); // Replace with your actual route
//   }
  
// }
export class PatientRecordComponent {
  appointmentId: number = 0;
  medicalRecord: any = null; // Single medical record based on appointmentId
  medicalRecords: any[] = []; // Array to store medical records
  patientId: number = 0; // Logged-in patient's ID
  doctorId: number = 0;
  role: string = ''; // User role
  UserId: number = 0;
  Username: string = '';

  private apiUrl = 'https://localhost:7159/api/MedicalRecords'; // API URL for medical records
  private patientApiUrl = 'https://localhost:7159/api/Patient'; // API URL for patient
  private doctorApiUrl = 'https://localhost:7159/api/Doctor';

  http = inject(HttpClient);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.Username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
        this.fetchPatientId(this.UserId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Get appointmentId from the query params and fetch corresponding medical record
    this.route.queryParams.subscribe((params) => {
      this.appointmentId = +params['appointmentId'];
      if (this.appointmentId) {
        // Fetch only the medical record associated with the appointmentId
        this.fetchMedicalRecordByAppointment();
      }
    });
  }

  downloadReport(record: any): void {
        const doc = new jsPDF();
      
        // Header Section with Colors
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(0, 51, 102); // Dark Blue
        doc.text('Medical Report', 105, 20, { align: 'center' });
      
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(105, 105, 105); // Gray
        doc.text('MediSphere Hospital', 105, 28, { align: 'center' });
        doc.text('Address: 123 Wellness Road, Health City | Contact: +1-123-456-7890', 105, 34, { align: 'center' });
      
        // Line below header
        doc.setDrawColor(200, 200, 200); // Light Gray
        doc.line(10, 40, 200, 40);
      
        // Patient Name in Center
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0); // Black
        doc.text(`Patient Name: ${this.Username}`, 105, 50, { align: 'center' });
      
        // Doctor Details Section with Background
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(230, 230, 250); // Lavender Blue Background
        doc.rect(10, 60, 190, 10, 'F'); // Draw filled rectangle
        doc.setTextColor(0, 0, 102); // Dark Blue Text
        doc.text('Doctor Details', 15, 67);
      
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Black
        doc.text(`Doctor Name: ${record.doctorName}`, 10, 80);
        doc.text(`Specialty: ${record.doctorSpecialty}`, 10, 90);
      
        // Consultation Details Section with Background
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(230, 230, 250); // Light Green Background
        doc.rect(10, 100, 190, 10, 'F'); // Draw filled rectangle
        doc.setTextColor(0, 0, 102); // Dark Green Text
        doc.text('Consultation Details', 15, 107);
      
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Black
        doc.text(`Consultation Date: ${record.consultationDate}`, 10, 120);
        doc.text(`Symptoms: ${record.symptoms}`, 10, 130);
        // doc.text(`Diagnosis: ${record.diagnosis || 'N/A'}`, 10, 140);
        doc.text(`Treatment Plan: ${record.treatmentPlan}`, 10, 140);
        doc.text(`Prescribed Tests: ${record.prescribedTests || 'N/A'}`, 10, 150);
      
        // Footer Section with Gray Line
        doc.setDrawColor(200, 200, 200); // Light Gray Line
        doc.line(10, 270, 200, 270);
      
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(105, 105, 105); // Gray Text
        doc.text('This report is generated for medical use only.', 105, 280, { align: 'center' });
        doc.text('MediSphere © 2025', 105, 285, { align: 'center' });
      
        // Save PDF
        doc.save(`Medical_Report_${this.Username}.pdf`);
      }

      viewPrescription(recordId: number): void {
        this.router.navigate(['/app-patient-prescription'], 
          { queryParams: { recordId : recordId } });
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
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.apiUrl}`, { headers }).subscribe(
      (medicalRecords) => {
        // Filter to only show the record related to the selected appointmentId
        this.medicalRecords = medicalRecords.filter(
          (medicalRecord) => medicalRecord.patientId === patientId && medicalRecord.appointmentId === this.appointmentId
        );
        this.medicalRecords.forEach((medicalRecord) => {
          this.fetchDoctorDetails(medicalRecord.doctorId, medicalRecord); // Fetch doctor info by doctorId
        });
        console.log("Filtered medical record:", this.medicalRecords);
      },
      (error) => {
        console.error('Error fetching records:', error);
      }
    );
  }

  fetchMedicalRecordByAppointment(): void {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${this.apiUrl}`, { headers }).subscribe(
      (records) => {
        // Filter to get the medical record by appointmentId
        this.medicalRecord = records.find((record) => record.appointmentId === this.appointmentId);
        if (this.medicalRecord) {
          this.fetchDoctorDetails(this.medicalRecord.doctorId, this.medicalRecord);
          console.log('Fetched Medical Record:', this.medicalRecord);
        } else {
          console.error('No record found for the given appointment ID.');
        }
      },
      (error) => console.error('Error fetching medical record:', error)
    );
  } 

  fetchDoctorDetails(doctorId: number, medicalRecords: any): void {
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Fetch doctor details by doctor ID
    this.http.get<any>(`${this.doctorApiUrl}/${doctorId}`, { headers }).subscribe(
      (doctor) => {
        if (doctor) {
          medicalRecords.doctorName = doctor.fullName; // Add doctor name to the appointment
          medicalRecords.doctorSpecialty = doctor.specialty; // Add doctor specialty to the appointment
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
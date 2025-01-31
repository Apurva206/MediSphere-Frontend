import { Component, OnInit } from '@angular/core';
import { MedicalReport, ReportService } from '../../Services/doctor-report-service.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-record.component.html',
  styleUrl: './doctor-record.component.css'
})
export class DoctorRecordComponent implements OnInit {
  medicalReport: MedicalReport = {
    recordId: 0,
    patientId: 0,
    doctorId: 0,
    appointmentId: 0,
    symptoms: '',
    consultationDate: '',
    treatmentPlan: '',
    prescribedTests: ''
  };
  
  appointmentId!: number;
  recordId!: number;
  isUpdateMode = false;

  constructor(
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe(params => {
    //   this.recordId = +params['recordId']; // Fetch the recordId from URL params
    //   if (this.recordId) {
    //     this.loadMedicalReport(this.appointmentId);  // Fetch the report based on the recordId
    //   } else {
    //     console.error('Invalid record ID');
    //     alert('Record ID is required to fetch the medical report.');
    //   }
    // });
    this.route.queryParams.subscribe((params) => {
      this.appointmentId = +params['appointmentId'];
      if (this.appointmentId) {
        // Fetch only the medical record associated with the appointmentId
        this.loadMedicalReport(this.appointmentId);
      }else {
            console.error('Invalid record ID');
            alert('Record ID is required to fetch the medical report.');
          }
    });
  }

  // Load medical report if it exists
  loadMedicalReport(appointmentId: number): void {
    // Validate appointmentId before calling service
    if (appointmentId) {
      this.reportService.fetchMedicalRecordByAppointment(appointmentId).subscribe(
        (report) => {
          if (report) {
            this.medicalReport = report;  // Pre-populate the form with fetched data
            this.isUpdateMode = true;      // Enable update mode
          } else {
            console.log('No report found for the given appointment ID.');
            alert('No report found for the given appointment ID.');
          }
        },
        (error) => {
          console.error('Error fetching report:', error);
          alert('Failed to load medical report. Please try again.');
        }
      );
    } else {
      console.error('Invalid appointment ID.');
      alert('Please provide a valid appointment ID.');
    }
  }

  // Save or update the medical report
  saveMedicalReport(): void {
    if (this.isUpdateMode) {
      this.reportService.updateMedicalReport(this.medicalReport.recordId!, this.medicalReport).subscribe(
        () => alert('Medical report updated successfully'),
        (error) => console.error('Error updating report:', error)
      );
    } else {
      this.reportService.addMedicalReport(this.medicalReport).subscribe(
        () => alert('Medical report added successfully'),
        (error) => console.error('Error adding report:', error)
      );
    }
  }
}

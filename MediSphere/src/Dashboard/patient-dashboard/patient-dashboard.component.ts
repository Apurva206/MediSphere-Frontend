import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faCalendarCheck, faNotesMedical, faFile, faRightFromBracket, faBookmark } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-patient-dashboard',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule,FormsModule, FontAwesomeModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent {
  faAddressCard=faAddressCard;
  faCalendarCheck=faCalendarCheck;
  faNotesMedical=faNotesMedical;
  faRightFromBracket=faRightFromBracket;
  faFile=faFile;
  fabookmark=faBookmark;

  patientProfile = {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    medicalHistory: '',
  };

  role: string = '';
  UserId: number = 0;
  Username: string = '';
  profileImage: string | null = null;
  patientId: number = 0;

  private apiUrl = 'https://localhost:7159/api/Patient'; // Replace with your API endpoint
  

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
        const patientId = parseInt(decoded["patientId"], 10);
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
        this.fetchPatientId(this.UserId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    // Load the profile image from localStorage
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    this.profileImage = savedImage;
  }
}

onImageUpload(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // Save the image to localStorage
      localStorage.setItem('profileImage', result);

      // Update the component's profile image
      this.profileImage = result;

      console.log('Image saved locally:', result);
    };

    reader.readAsDataURL(file); // Convert file to Base64 string
  }
}

fetchPatientId(userId: number): void {
  const patientApiUrl = `https://localhost:7159/api/Patient`;
  this.http.get<any[]>(patientApiUrl).subscribe(
    (patients) => {
      const patient = patients.find(p => p.userId === userId);
      if (patient && patient.patientId) {
        this.patientId = patient.patientId;
        console.log('Patient ID fetched:', this.patientId);
        this.loadPatientProfile();
      } else {
        console.error('Patient not found for the given UserId.');
      }
    },
    (error) => {
      console.error('Error fetching patients:', error);
    }
  );
}

loadPatientProfile(): void {
  const token = localStorage.getItem('authToken'); // Retrieve the token
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get(`${this.apiUrl}/${this.patientId}`, { headers }).subscribe(
    (response: any) => {
      // Populate the patientProfile with fetched data
      this.patientProfile = {
        fullName: response.fullName || '',
        dateOfBirth: response.dateOfBirth ? response.dateOfBirth.split('T')[0] : '', // Slice the date string
        gender: response.gender || '',
        contactNumber: response.contactNumber || '',
        address: response.address || '',
        medicalHistory: response.medicalHistory || '',
      };
      console.log('Patient profile loaded:', this.patientProfile);
    },
    (error) => {
      console.error('Error loading patient profile:', error);
    }
  );
}
logout(): void {
  localStorage.removeItem('authToken'); // Remove the token
  this.router.navigate(['/app-login']); // Redirect to the login page
}

  onSubmit(): void {
    if (!this.UserId) {
      console.error('User ID is not found');
      return;
    }
  
    const token = localStorage.getItem('authToken'); // Retrieve the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    if (this.patientId === 0) {
      // Create a new patient profile
      const patientData = {
        ...this.patientProfile,
        userId: this.UserId,
      };
  
      this.http.post(`${this.apiUrl}`, patientData, { headers }).subscribe(
        (response: any) => {
          console.log('Patient profile created successfully!', response);
          alert('Profile created successfully');
          // Update patientId from response if needed
          this.patientId = response.patientId || 0;
        },
        (error) => {
          console.error('Error creating patient profile:', error);
        }
      );
    } else {
      // Update an existing patient profile
      const patientData = {
        ...this.patientProfile,
        patientId: this.patientId,
        userId: this.UserId,
      };
  
      this.http.put(`${this.apiUrl}/${this.patientId}`, patientData, { headers }).subscribe(
        (response: any) => {
          console.log('Patient profile updated successfully!', response);
          alert('Profile updated successfully');
        },
        (error) => {
          console.error('Error updating patient profile:', error);
        }
      );
    }
  }
  
}

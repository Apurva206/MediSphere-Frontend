import { Component, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faCalendarCheck, faNotesMedical, faFile, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-doctor-dashboard',
  imports: [RouterLink,RouterLinkActive,RouterOutlet,CommonModule,FormsModule,FontAwesomeModule],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent {
  faAddressCard=faAddressCard;
  faCalendarCheck=faCalendarCheck;
  faNotesMedical=faNotesMedical;
  faRightFromBracket=faRightFromBracket;
  faFile=faFile;


  doctorProfile = {
    fullName: '',
    specialty: '',
    experience: '',
    qualification: '',
    designation: '',
    contactNumber: ''
  };

  Username: string = '';
  role: string = '';
  UserId: number = 0; 
  doctorId: number = 0;
  profileImage: string | null = null;

  private apiUrl = 'https://localhost:7159/api/Doctor'; // Replace with your API endpoint
    http = inject(HttpClient);

  constructor(private router: Router){

  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.Username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
        this.fetchDoctorId(this.UserId)
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

  fetchDoctorId(userId: number): void {
    const headers = new HttpHeaders();
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe(
      (doctors) => {
        console.log('Doctor Data:', doctors);  // Log the entire response
        const doctor = doctors.find(d => d.userId == userId);
        console.log('Found Doctor:', doctor);  // Log the found doctor
  
        if (doctor && doctor.doctorId) {
          this.doctorId = doctor.doctorId;
          console.log('Doctor ID fetched:', this.doctorId);
          this.loadDoctorProfile();
        } else {
          console.error('Doctor not found for the given UserId.');
        }
      },
      (error) => {
        console.error('Error fetching doctor data:', error);
      }
    );
  }

  loadDoctorProfile(){

    if (!this.doctorId) {
      console.error('Doctor ID is not available.');
      return;
    }
  
    const headers = new HttpHeaders();
    this.http.get<any>(`${this.apiUrl}/${this.doctorId}`, { headers }).subscribe(
      (doctor) => {
        if (doctor) {
          console.log('Doctor Profile Data:', doctor);
          this.doctorProfile = {
            fullName: doctor.fullName || '',
            specialty: doctor.specialty || '',
            experience: doctor.experience || '',
            qualification: doctor.qualification || '',
            designation: doctor.designation || '',
            contactNumber: doctor.contactNumber || ''
          };
        } else {
          console.error('Doctor profile not found.');
        }
      },
      (error) => {
        console.error('Error fetching doctor profile:', error);
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

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.doctorId === 0) {
      // Create a new doctor profile
      const doctorData = {
        ...this.doctorProfile,
        userId: this.UserId
      };

      this.http.post(this.apiUrl, doctorData, { headers }).subscribe(
        (response: any) => {
          console.log('Doctor profile created successfully!', response);
          alert('Profile created successfully');
          this.doctorId = response.doctorId || 0;
        },
        (error) => {
          console.error('Error creating doctor profile:', error);
        }
      );
    } else {
      // Update existing doctor profile
      const doctorData = {
        ...this.doctorProfile,
        doctorId: this.doctorId,
        userId: this.UserId
      };

      this.http.put(`${this.apiUrl}/${this.doctorId}`, doctorData, { headers }).subscribe(
        (response: any) => {
          console.log('Doctor profile updated successfully!', response);
          alert('Profile updated successfully');
        },
        (error) => {
          console.error('Error updating doctor profile:', error);
        }
      );
    }
  }
}

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


  private apiUrl = 'https://localhost:7159/api/Doctor'; // Replace with your API endpoint
    http = inject(HttpClient);

  constructor(private router: Router){

  }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ [key: string]: any }>(token);
        this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
        this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
        console.log('Decoded Token:', decoded); // Optional: To verify the token structure
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  } 


  onSubmit() {
    if (!this.UserId) {
      console.error('User ID is not found');
      return;
    }

    if (this.role === 'Doctor') {
      const doctorData = {
        ...this.doctorProfile,
        userId: this.UserId, // Ensure userId matches the logged-in user's ID
      };

      const token = localStorage.getItem('authToken'); // Retrieve the token
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post(this.apiUrl, doctorData, { headers }).subscribe(
        (response: any) => {
          console.log('Doctor profile created successfully!', response);
          alert('Profile updated successfully');
        },
        // (error) => {
        //   console.error('Error creating/updating profile:', error);
        // }
      );
    } else {
      console.error('Only doctor can access this dashboard');
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user = {
    Username: '',
    Email: '',
    password:'',
    confirmPassword:'',
    Role: ''
  };
  // Role: string = 'Doctor'; // Default role
  errorMessage: string = '';
  successMessage: string = '';
  isRegistered: boolean = false;
   fetcheduser: any = null;

   constructor(private http: HttpClient, private router:Router) {}  // Inject HttpClient here
  
  onSubmit() {
    // Check if passwords match
    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Prepare the data to be sent to the backend
    const payload = {
      username: this.user.Username,
      email: this.user.Email,
      password: this.user.password,
      Role: this.user.Role // Default role sent to the backend
    };

    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Send data to the backend via POST API
    this.http.post('https://localhost:7159/api/User/register', payload, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          // Success: Display success message and store data in local storage
          this.successMessage = 'User registered successfully!';
          this.isRegistered = true;  // Set the flag for successful registration
          localStorage.setItem('UserDetails', JSON.stringify(this.user));  // Store user data in localStorage
          //console.log('Registration response:', response);  // Log the response for debugging
          // Show success alert
          console.log('Registration successful, now showing alert');
          alert('Registration successful! You can now log in.');
          this.router.navigate(['/app-login']);  // Navigate to login page
        
        }
        
      });
      
   }
  

   fetchData() {
    
    const storedEmployee = JSON.parse(localStorage.getItem('UserDetails') || '{}');
    this.fetcheduser = storedEmployee;
    console.log('Fetched User Data:', this.fetcheduser);
    }
    resetForm() {
      console.log('Resetting form'); // Debug log
    this.isRegistered = false; // Hide the success message
    this.successMessage = ''; // Clear success message
    this.errorMessage = ''; // Clear error message
    this.user = { Username: '',Email:'', password: '', confirmPassword: '', Role:''}; // Reset user object
    }
}

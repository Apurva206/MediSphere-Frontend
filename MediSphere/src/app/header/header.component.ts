import { Component } from '@angular/core';
import { Router, RouterLink,RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHospital,faUser,faUserPlus,faHouse,faRightFromBracket,faUserEdit,faCaretDown} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,FontAwesomeModule, RouterOutlet,CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  faHospital = faHospital; 
  faUser=faUser;
  faUserPlus=faUserPlus;
  faHouse=faHouse;
  faRightFromBracket=faRightFromBracket;
  faUserEdit = faUserEdit;
  faCaretDown = faCaretDown;

  role: string = ''; // User role
  UserId: number =0;
  Username: string = '';
  isLoggedIn = false;

  constructor(private router:Router){

  }

  ngOnInit(): void {
      const token = localStorage.getItem('authToken');
      this.isLoggedIn = !!token;
      if (token) {
        try {
          const decoded = jwtDecode<{ [key: string]: any }>(token);
          this.Username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '';
          this.role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || '';
          this.UserId = parseInt(decoded["UserId"], 10);  // Ensure 'UserId' is present in the token
          console.log('Decoded Token:', decoded); // Optional: To verify the token structure
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('authToken'); // Remove the token
    this.router.navigate(['/app-login']); // Redirect to the login page
  }
  
}

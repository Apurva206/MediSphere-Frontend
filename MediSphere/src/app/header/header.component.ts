import { Component } from '@angular/core';
import { Router, RouterLink,RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHospital,faUser,faUserPlus,faHouse,faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
//import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,FontAwesomeModule, RouterOutlet,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  faHospital = faHospital; 
  faUser=faUser;
  faUserPlus=faUserPlus;
  faHouse=faHouse;
  faRightFromBracket=faRightFromBracket;
  constructor(private router:Router){

  }

  logout(): void {
    localStorage.removeItem('authToken'); // Remove the token
    this.router.navigate(['/app-login']); // Redirect to the login page
  }
  
}

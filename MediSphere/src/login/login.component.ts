import { Component,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginObj:any = {
    Username: '',
    Email:'', 
    Password: ''
  };
  errorMessage: string = '';
  isLoggedIn: boolean = false;

  http=inject(HttpClient);

  constructor(private router:Router){

  }

  onLoginSubmit(){
    this.http.post("https://localhost:7159/api/User/login",this.loginObj).subscribe((res:any)=>{
      console.log('API Response:', res); 
      if(res && res.username && res.token && res.role){
        alert("Login Success");
        localStorage.setItem('authToken', res.token);
         // Decode the token as 'any' or an indexable object
        const decodedToken = jwtDecode(res.token) as { [key: string]: any };
        console.log(decodedToken);
        var role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem('role',res.role);
        if(role=="Doctor"){
          this.router.navigate(["/app-doctor-dashboard"]);
        }
        else if(res.role=='Patient'){
          this.router.navigate(["/app-patient-dashboard"]);
        }
      }
      else{
        alert("check username or password");
      }
    },
    (error: any) => {
      if (error.status === 401) {
          alert("Check Your Login Credentials!");
      }
  })
  }
  
  
}

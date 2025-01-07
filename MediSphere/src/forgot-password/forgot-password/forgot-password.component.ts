import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//import { OtpServiceService } from '../../services/otp-service.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
//import { LoginServicesService } from '../../services/login-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;
  constructor(private httpClient:HttpClient,private router:Router){
    this.forgotPasswordForm=new FormGroup(
      {
        emailAddress:new FormControl('',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+(?:\.[a-zA-Z0-9._%+-]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])
      }
    );
  }
  sendEmailCred(){
    if (this.forgotPasswordForm.valid){
      var formData = new FormData();
      const emailAddress = this.forgotPasswordForm.get("emailAddress")?.value;
      formData.append('emailAddress',emailAddress);
      this.httpClient.post("https://localhost:7159/api/User/forgotPassword",formData).subscribe((res:any)=>{
        alert("Successfully sent login credential to your email.");
        this.router.navigate(["/app-login"]);
      });
    }else {
      alert("Cannot be empty or invalid email format.")
    }
  }
}

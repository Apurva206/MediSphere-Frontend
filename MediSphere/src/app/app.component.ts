import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router,NavigationEnd } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CommonModule, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  title = 'MediSphere';
 hideFooter: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route includes "register"
        this.hideFooter = event.urlAfterRedirects === '/app-login' || event.urlAfterRedirects === '/app-register'|| 
        event.urlAfterRedirects === '/app-patient-dashboard'|| event.urlAfterRedirects === '/app-doctor-dashboard';
      }
    });
  }
}

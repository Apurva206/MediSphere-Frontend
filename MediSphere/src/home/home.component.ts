import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeartPulse, faStethoscope, faSuitcaseMedical,faComment } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  faHeartPulse=faHeartPulse;
  faStethoscope=faStethoscope;
  faSuitcaseMedical=faSuitcaseMedical;
  faComment=faComment;
}

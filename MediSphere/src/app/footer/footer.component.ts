import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHospital} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faYoutube, faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-footer',
  imports: [FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  faLocationDot=faLocationDot;
  faHospital=faHospital;
  faInstagram = faInstagram;
  faYoutube = faYoutube;
  faFacebook= faFacebook;
  faTwitter = faTwitter
}

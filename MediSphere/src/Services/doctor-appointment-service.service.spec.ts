import { TestBed } from '@angular/core/testing';

import { AppointmentService } from './doctor-appointment-service.service';

describe('DoctorAppointmentServiceService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

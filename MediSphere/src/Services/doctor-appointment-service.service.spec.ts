import { TestBed } from '@angular/core/testing';

import { DoctorAppointmentServiceService } from './doctor-appointment-service.service';

describe('DoctorAppointmentServiceService', () => {
  let service: DoctorAppointmentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorAppointmentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

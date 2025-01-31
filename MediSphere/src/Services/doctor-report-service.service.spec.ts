import { TestBed } from '@angular/core/testing';

import { DoctorReportServiceService } from './doctor-report-service.service';

describe('DoctorReportServiceService', () => {
  let service: DoctorReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorRecordComponent } from './doctor-record.component';

describe('DoctorRecordComponent', () => {
  let component: DoctorRecordComponent;
  let fixture: ComponentFixture<DoctorRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDashboardStatusComponent } from './kyc-dashboard-status.component';

describe('KycDashboardStatusComponent', () => {
  let component: KycDashboardStatusComponent;
  let fixture: ComponentFixture<KycDashboardStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KycDashboardStatusComponent]
    });
    fixture = TestBed.createComponent(KycDashboardStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

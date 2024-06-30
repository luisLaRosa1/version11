import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDashboardComponent } from './kyc-dashboard.component';

describe('KycDashboardComponent', () => {
  let component: KycDashboardComponent;
  let fixture: ComponentFixture<KycDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KycDashboardComponent]
    });
    fixture = TestBed.createComponent(KycDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

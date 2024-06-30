import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNacionalidadComponent } from './form-nacionalidad.component';

describe('FormNacionalidadComponent', () => {
  let component: FormNacionalidadComponent;
  let fixture: ComponentFixture<FormNacionalidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormNacionalidadComponent]
    });
    fixture = TestBed.createComponent(FormNacionalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEmployeeInformationPage } from './edit-employee-information.page';

describe('EditEmployeeInformationPage', () => {
  let component: EditEmployeeInformationPage;
  let fixture: ComponentFixture<EditEmployeeInformationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeeInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

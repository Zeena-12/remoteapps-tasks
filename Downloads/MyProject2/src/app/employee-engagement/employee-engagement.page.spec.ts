import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeEngagementPage } from './employee-engagement.page';

describe('EmployeeEngagementPage', () => {
  let component: EmployeeEngagementPage;
  let fixture: ComponentFixture<EmployeeEngagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEngagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

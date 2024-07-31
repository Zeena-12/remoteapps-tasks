import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantsPage } from './applicants.page';

describe('ApplicantsPage', () => {
  let component: ApplicantsPage;
  let fixture: ComponentFixture<ApplicantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

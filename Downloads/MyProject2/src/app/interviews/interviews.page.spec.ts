import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewsPage } from './interviews.page';

describe('InterviewsPage', () => {
  let component: InterviewsPage;
  let fixture: ComponentFixture<InterviewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewExperiencePage } from './new-experience.page';

describe('NewExperiencePage', () => {
  let component: NewExperiencePage;
  let fixture: ComponentFixture<NewExperiencePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExperiencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

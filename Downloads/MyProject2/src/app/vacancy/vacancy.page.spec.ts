import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacancyPage } from './vacancy.page';

describe('VacancyPage', () => {
  let component: VacancyPage;
  let fixture: ComponentFixture<VacancyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FourthPage } from './fourth.page';

describe('FourthPage', () => {
  let component: FourthPage;
  let fixture: ComponentFixture<FourthPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FourthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

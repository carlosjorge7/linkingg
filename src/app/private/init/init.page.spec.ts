import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitPage } from './init.page';

describe('InitPage', () => {
  let component: InitPage;
  let fixture: ComponentFixture<InitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

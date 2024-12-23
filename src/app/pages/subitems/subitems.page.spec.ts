import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubitemsPage } from './subitems.page';

describe('SubitemsPage', () => {
  let component: SubitemsPage;
  let fixture: ComponentFixture<SubitemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubitemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

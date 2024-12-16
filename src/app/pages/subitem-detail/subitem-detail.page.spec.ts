import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubitemDetailPage } from './subitem-detail.page';

describe('SubitemDetailPage', () => {
  let component: SubitemDetailPage;
  let fixture: ComponentFixture<SubitemDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubitemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

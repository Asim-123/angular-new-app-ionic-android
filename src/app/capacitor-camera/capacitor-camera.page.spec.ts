import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapacitorCameraPage } from './capacitor-camera.page';

describe('CapacitorCameraPage', () => {
  let component: CapacitorCameraPage;
  let fixture: ComponentFixture<CapacitorCameraPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CapacitorCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

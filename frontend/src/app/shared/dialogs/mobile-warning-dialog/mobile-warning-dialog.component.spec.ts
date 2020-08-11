import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileWarningDialogComponent } from './mobile-warning-dialog.component';

describe('MobileWarningDialogComponent', () => {
  let component: MobileWarningDialogComponent;
  let fixture: ComponentFixture<MobileWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesHistoryComponent } from './files-history.component';

describe('FilesHistoryComponent', () => {
  let component: FilesHistoryComponent;
  let fixture: ComponentFixture<FilesHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

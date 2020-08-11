import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscSpaceComponent } from './disc-space.component';

describe('DiscSpaceComponent', () => {
  let component: DiscSpaceComponent;
  let fixture: ComponentFixture<DiscSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

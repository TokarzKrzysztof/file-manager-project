import { TestBed } from '@angular/core/testing';

import { MobileGuard } from './mobile.guard';

describe('MobileGuard', () => {
  let guard: MobileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MobileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

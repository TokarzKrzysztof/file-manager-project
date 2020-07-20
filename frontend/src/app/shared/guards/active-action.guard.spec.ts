import { TestBed } from '@angular/core/testing';

import { ActiveActionGuard } from './active-action.guard';

describe('ActiveActionGuard', () => {
  let guard: ActiveActionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActiveActionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TaskboardService } from './taskboard.service';

describe('TaskboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskboardService = TestBed.get(TaskboardService);
    expect(service).toBeTruthy();
  });
});

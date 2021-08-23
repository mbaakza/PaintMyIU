import { TestBed } from '@angular/core/testing';

import { ColorApiService } from './color-api.service';

describe('ColorApiService', () => {
  let service: ColorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

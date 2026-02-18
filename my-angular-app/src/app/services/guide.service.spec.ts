import { TestBed } from '@angular/core/testing';
import { ServiceGuide } from './guide.service';
import { provideHttpClient } from '@angular/common/http';

describe('ServiceGuide', () => {
  let service: ServiceGuide;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceGuide,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(ServiceGuide);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // tests à compléter...
});

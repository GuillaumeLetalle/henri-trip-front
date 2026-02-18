import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposantDetailGuide } from './guide-detail.component';
import { ServiceGuide } from '../../services/guide.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ComposantDetailGuide', () => {
  let component: ComposantDetailGuide;
  let fixture: ComponentFixture<ComposantDetailGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposantDetailGuide],
      providers: [
        ServiceGuide,
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposantDetailGuide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

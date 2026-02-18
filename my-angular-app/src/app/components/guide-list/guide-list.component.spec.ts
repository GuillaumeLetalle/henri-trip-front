import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposantListeGuides } from './guide-list.component';
import { ServiceGuide } from '../../services/guide.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ComposantListeGuides', () => {
  let component: ComposantListeGuides;
  let fixture: ComponentFixture<ComposantListeGuides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposantListeGuides],
      providers: [
        ServiceGuide,
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComposantListeGuides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser avec une liste vide', () => {
    expect(component.guides.length).toBe(0);
  });

  // TODO: ajouter plus de tests
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposantListeGuides } from './guide-list.component';
import { ServiceGuide } from '../../services/guide.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { GuideResume } from '../../models/guide.model';

class ServiceGuideStub {
  private guides: GuideResume[] = [
    {
      id: '1',
      titre: 'Lisbonne à pied',
      description: 'Escapade sur 3 jours',
      destination: 'Lisbonne',
      duree: 3
    },
    {
      id: '2',
      titre: 'Tokyo nocturne',
      description: 'Itinéraire pour noctambules avertis',
      destination: 'Tokyo',
      duree: 5
    }
  ];

  obtenirGuides() {
    return of(this.guides);
  }

  rechercherGuides(termeRecherche: string) {
    return of(
      this.guides.filter(guide =>
        guide.titre.toLowerCase().includes(termeRecherche.toLowerCase())
      )
    );
  }
}

describe('ComposantListeGuides', () => {
  let component: ComposantListeGuides;
  let fixture: ComponentFixture<ComposantListeGuides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComposantListeGuides],
      providers: [
        { provide: ServiceGuide, useClass: ServiceGuideStub },
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

  it('devrait charger les guides du service stub', () => {
    expect(component.guides.length).toBe(2);
    expect(component.statistiques.total).toBe(2);
  });

  it('devrait mettre à jour les statistiques', () => {
    const guides: GuideResume[] = [
      { id: '3', titre: 'Rome gourmand', description: 'Pasta et curiosités', destination: 'Rome', duree: 4 },
      { id: '4', titre: 'Rome express', description: '24h chrono', destination: 'Rome', duree: 1 }
    ];

    (component as any).mettreAJourStatistiques(guides);

    expect(component.statistiques.destinations).toBe(1);
    expect(component.statistiques.destinationPreferee).toBe('Rome');
    expect(component.destinationsPhare[0]).toBe('Rome');
  });

  it('devrait fournir une légende contextualisée', () => {
    (component as any).mettreAJourStatistiques(component.guides);
    const legende = component.obtenirLegendeDestinations();
    expect(legende.length).toBeGreaterThan(0);
  });
});

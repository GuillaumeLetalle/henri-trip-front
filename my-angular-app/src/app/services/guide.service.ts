import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { Guide, GuideResume } from '../models/guide.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceGuide {
  private urlApi = `${environment.apiUrl}/guides`;
  private cacheGuides = new BehaviorSubject<GuideResume[]>([]);
  public guides$ = this.cacheGuides.asObservable();

  // Données mockées temporaires (en attendant le backend)
  private donneesDemo: GuideResume[] = [
    {
      id: '1',
      titre: 'Tokyo en 7 jours',
      description: 'Découvrez la capitale japonaise entre tradition et modernité',
      destination: 'Tokyo',
      duree: 7,
      imageCouverture: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400'
    },
    {
      id: '2',
      titre: 'Road Trip en Islande',
      description: 'Un voyage inoubliable à travers les paysages volcaniques',
      destination: 'Islande',
      duree: 10,
      imageCouverture: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400'
    },
    {
      id: '3',
      titre: 'Week-end à Lisbonne',
      description: 'Explorez les ruelles colorées de la capitale portugaise',
      destination: 'Lisbonne',
      duree: 3,
      imageCouverture: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400'
    }
  ];

  constructor(private http: HttpClient) {
    // console.log('Service guide initialisé');
  }

  obtenirGuides(): Observable<GuideResume[]> {
    // Mode démo : retourner les données mockées
    // TODO: Activer l'API une fois le backend disponible
    return of(this.donneesDemo).pipe(
      delay(500), // Simule un délai réseau
      tap(guides => this.cacheGuides.next(guides))
    );
    
    // Version avec backend (à activer plus tard):
    // return this.http.get<GuideResume[]>(this.urlApi).pipe(
    //   tap(guides => this.cacheGuides.next(guides)),
    //   catchError(this.gererErreur)
    // );
  }

  obtenirGuideParId(id: string): Observable<Guide> {
    // Mode démo : créer un guide détaillé
    const guideResume = this.donneesDemo.find(g => g.id === id);
    if (!guideResume) {
      return throwError(() => new Error('Guide non trouvé'));
    }

    const guideComplet: Guide = {
      ...guideResume,
      journees: [
        {
          id: 'j1',
          numeroJour: 1,
          titre: 'Arrivée et découverte',
          description: 'Installation et première exploration',
          activites: [
            {
              id: 'a1',
              titre: 'Arrivée à l\'aéroport',
              description: 'Transfert vers l\'hôtel',
              heureDebut: '10:00',
              heureFin: '12:00',
              lieu: 'Aéroport',
              ordre: 1
            },
            {
              id: 'a2',
              titre: 'Tour de quartier',
              description: 'Balade dans les environs',
              heureDebut: '15:00',
              heureFin: '18:00',
              lieu: 'Centre-ville',
              ordre: 2
            }
          ]
        },
        {
          id: 'j2',
          numeroJour: 2,
          titre: 'Visite culturelle',
          description: 'Découverte des sites principaux',
          activites: [
            {
              id: 'a3',
              titre: 'Musée national',
              description: 'Visite guidée du musée',
              heureDebut: '09:00',
              heureFin: '12:00',
              lieu: 'Musée',
              ordre: 1
            }
          ]
        }
      ]
    };

    return of(guideComplet).pipe(delay(300));
    
    // Version avec backend:
    // return this.http.get<Guide>(`${this.urlApi}/${id}`).pipe(
    //   catchError(this.gererErreur)
    // );
  }

  rechercherGuides(termeRecherche: string): Observable<GuideResume[]> {
    return this.guides$.pipe(
      map(guides => guides.filter(guide =>
        guide.titre.toLowerCase().includes(termeRecherche.toLowerCase()) ||
        guide.description.toLowerCase().includes(termeRecherche.toLowerCase()) ||
        guide.destination?.toLowerCase().includes(termeRecherche.toLowerCase())
      ))
    );
  }

  filtrerParDestination(destination: string): Observable<GuideResume[]> {
    return this.guides$.pipe(
      map(guides => guides.filter(guide =>
        guide.destination?.toLowerCase() === destination.toLowerCase()
      ))
    );
  }

  private gererErreur(erreur: HttpErrorResponse): Observable<never> {
    let messageErreur = 'Une erreur est survenue';

    if (erreur.error instanceof ErrorEvent) {
      messageErreur = `Erreur: ${erreur.error.message}`;
    } else {
      messageErreur = `Code d'erreur: ${erreur.status}\nMessage: ${erreur.message}`;
    }

    console.error(messageErreur);
    return throwError(() => new Error(messageErreur));
  }
}

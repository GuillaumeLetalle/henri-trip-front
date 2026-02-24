import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Guide, GuideResume } from '../models/guide.model';
import { GuideApiService } from './guide-api.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceGuide {
  private cacheGuides = new BehaviorSubject<GuideResume[]>([]);
  public guides$ = this.cacheGuides.asObservable();
  constructor(private guideApi: GuideApiService) {}

  obtenirGuides(): Observable<GuideResume[]> {
    return this.guideApi.fetchGuides().pipe(
      tap(guides => this.cacheGuides.next(guides)),
      catchError(erreur => this.gererErreur(erreur))
    );
  }

  obtenirGuideParId(id: string): Observable<Guide> {
    return this.guideApi.fetchGuideById(id).pipe(
      catchError(erreur => this.gererErreur(erreur))
    );
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
    console.error('Erreur API guides:', erreur);
    return throwError(() => erreur);
  }
}

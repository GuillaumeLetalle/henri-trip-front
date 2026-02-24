import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceGuide } from '../../services/guide.service';
import { GuideResume } from '../../models/guide.model';

interface StatistiquesGuides {
  total: number;
  destinations: number;
  guideLePlusLong: GuideResume | null;
  destinationPreferee: string | null;
}

@Component({
  selector: 'app-liste-guides',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guide-list.component.html',
  styleUrls: ['./guide-list.component.css']
})
export class ComposantListeGuides implements OnInit, OnDestroy {
  guides: GuideResume[] = [];
  guidesFiltres: GuideResume[] = [];
  termeRecherche: string = '';
  chargementEnCours: boolean = false;
  erreur: string | null = null;
  imageDefaut = 'assets/images/default-guide.jpg';
  dernierRafraichissement: Date | null = null;
  rechercheEnCours = false;
  statistiques: StatistiquesGuides = this.creerStatistiquesInitiales();
  destinationsPhare: string[] = [];
  readonly messageAccueil = this.obtenirMessageAccueil();
  
  private destruction$ = new Subject<void>();
  private sujetRecherche = new Subject<string>();

  constructor(
    private serviceGuide: ServiceGuide,
    private routeur: Router
  ) {}

  ngOnInit(): void {
    this.chargerGuides();
    this.configurerRecherche();
  }

  ngOnDestroy(): void {
    this.destruction$.next();
    this.destruction$.complete();
  }

  chargerGuides(): void {
    this.chargementEnCours = true;
    this.erreur = null;

    this.serviceGuide.obtenirGuides()
      .pipe(takeUntil(this.destruction$))
      .subscribe({
        next: (guides) => {
          this.guides = guides;
          this.guidesFiltres = guides;
          this.mettreAJourStatistiques(guides);
          this.dernierRafraichissement = new Date();
          this.chargementEnCours = false;
        },
        error: (erreur: HttpErrorResponse) => {
          this.erreur = this.formaterMessageErreur(erreur);
          this.chargementEnCours = false;
        }
      });
  }

  private configurerRecherche(): void {
    this.sujetRecherche
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destruction$)
      )
      .subscribe(termeRecherche => {
        this.effectuerRecherche(termeRecherche);
      });
  }

  changementRecherche(termeRecherche: string): void {
    this.termeRecherche = termeRecherche;
    this.sujetRecherche.next(termeRecherche);
  }

  private effectuerRecherche(termeRecherche: string): void {
    if (!termeRecherche.trim()) {
      this.guidesFiltres = this.guides;
      this.rechercheEnCours = false;
      return;
    }

    this.rechercheEnCours = true;
    this.serviceGuide.rechercherGuides(termeRecherche)
      .pipe(takeUntil(this.destruction$))
      .subscribe({
        next: (resultats) => {
          this.guidesFiltres = resultats;
          this.rechercheEnCours = false;
        },
        error: () => {
          this.rechercheEnCours = false;
        }
      });
  }

  afficherDetailsGuide(idGuide: string): void {
    this.routeur.navigate(['/guides', idGuide]);
  }

  rafraichir(): void {
    this.termeRecherche = '';
    this.chargerGuides();
  }

  private formaterMessageErreur(erreur: unknown): string {
    if (erreur instanceof HttpErrorResponse) {
      if (erreur.status === 404 && erreur.error?.message) {
        return erreur.error.message;
      }
      return erreur.error?.message || 'Une erreur est survenue lors de la récupération des guides.';
    }
    return 'Une erreur inattendue est survenue.';
  }

  private creerStatistiquesInitiales(): StatistiquesGuides {
    return {
      total: 0,
      destinations: 0,
      guideLePlusLong: null,
      destinationPreferee: null
    };
  }

  private mettreAJourStatistiques(guides: GuideResume[]): void {
    const destinations = new Map<string, number>();
    let guideLePlusLong: GuideResume | null = null;

    guides.forEach(guide => {
      if (guide.destination) {
        const cle = guide.destination.trim();
        destinations.set(cle, (destinations.get(cle) || 0) + 1);
      }

      if (guide.duree) {
        if (!guideLePlusLong || (guideLePlusLong.duree ?? 0) < guide.duree) {
          guideLePlusLong = guide;
        }
      }
    });

    this.statistiques = {
      total: guides.length,
      destinations: destinations.size,
      guideLePlusLong,
      destinationPreferee: this.identifierDestinationPreferee(destinations)
    };

    this.destinationsPhare = Array.from(destinations.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([destination]) => destination);
  }

  private identifierDestinationPreferee(destinations: Map<string, number>): string | null {
    let destinationPreferee: string | null = null;
    let max = 0;

    destinations.forEach((count, destination) => {
      if (count > max) {
        destinationPreferee = destination;
        max = count;
      }
    });

    return destinationPreferee;
  }

  obtenirMessageAccueil(): string {
    const heure = new Date().getHours();
    if (heure < 12) {
      return 'Bonjour, carnet de route en main.';
    }
    if (heure < 18) {
      return 'Après-midi d’exploration : place aux repérages.';
    }
    return 'Soirée atelier : on affine les guides avant de partir.';
  }

  obtenirLegendeDestinations(): string {
    if (!this.statistiques.destinationPreferee) {
      return 'Aucune destination favorite ne se détache encore.';
    }
    return `On parle beaucoup de ${this.statistiques.destinationPreferee}, mais la curiosité reste ouverte.`;
  }
}

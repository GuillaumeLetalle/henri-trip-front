import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceGuide } from '../../services/guide.service';
import { GuideResume } from '../../models/guide.model';

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
          console.log('Guides chargés:', guides.length);
          this.guides = guides;
          this.guidesFiltres = guides;
          this.chargementEnCours = false;
        },
        error: (erreur) => {
          this.erreur = 'Impossible de charger les guides. Veuillez réessayer.';
          this.chargementEnCours = false;
          console.error('Erreur lors du chargement des guides:', erreur);
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
      return;
    }

    // TODO: ajouter un indicateur de recherche en cours
    this.serviceGuide.rechercherGuides(termeRecherche)
      .pipe(takeUntil(this.destruction$))
      .subscribe(resultats => {
        this.guidesFiltres = resultats;
      });
  }

  afficherDetailsGuide(idGuide: string): void {
    this.routeur.navigate(['/guides', idGuide]);
  }

  rafraichir(): void {
    this.termeRecherche = '';
    this.chargerGuides();
  }

  obtenirImageGuide(guide: GuideResume): string {
    return guide.imageCouverture || 'assets/images/default-guide.jpg';
  }
}

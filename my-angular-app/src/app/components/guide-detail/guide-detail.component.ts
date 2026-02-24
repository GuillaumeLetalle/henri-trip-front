import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceGuide } from '../../services/guide.service';
import { Guide, Journee, Activite } from '../../models/guide.model';

@Component({
  selector: 'app-detail-guide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-detail.component.html',
  styleUrls: ['./guide-detail.component.css']
})
export class ComposantDetailGuide implements OnInit, OnDestroy {
  guide: Guide | null = null;
  journeeSelectionnee: Journee | null = null;
  chargementEnCours: boolean = false;
  erreur: string | null = null;
  imageDefaut = 'assets/images/default-guide.jpg';
  
  private destruction$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private routeur: Router,
    private serviceGuide: ServiceGuide
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destruction$))
      .subscribe(params => {
        const idGuide = params['id'];
        if (idGuide) {
          this.chargerDetailsGuide(idGuide);
        }
      });
  }

  ngOnDestroy(): void {
    this.destruction$.next();
    this.destruction$.complete();
  }

  chargerDetailsGuide(idGuide: string): void {
    this.chargementEnCours = true;
    this.erreur = null;

    this.serviceGuide.obtenirGuideParId(idGuide)
      .pipe(takeUntil(this.destruction$))
      .subscribe({
        next: (guide) => {
          this.guide = guide;
          if (guide.journees && guide.journees.length > 0) {
            this.journeeSelectionnee = guide.journees[0];
          }
          this.chargementEnCours = false;
        },
        error: (erreur: HttpErrorResponse) => {
          this.erreur = this.formaterMessageErreur(erreur);
          this.chargementEnCours = false;
          console.error('Erreur lors du chargement du guide:', erreur);
        }
      });
  }

  selectionnerJournee(journee: Journee): void {
    this.journeeSelectionnee = journee;
  }

  retour(): void {
    this.routeur.navigate(['/guides']);
  }

  obtenirActivitesTriees(): Activite[] {
    if (!this.journeeSelectionnee) return [];
    return [...this.journeeSelectionnee.activites].sort((a, b) => a.ordre - b.ordre);
  }

  private formaterMessageErreur(erreur: unknown): string {
    if (erreur instanceof HttpErrorResponse) {
      if (erreur.status === 404 && erreur.error?.message) {
        return erreur.error.message;
      }
      return erreur.error?.message || 'Impossible de charger les détails du guide.';
    }
    return 'Une erreur inattendue est survenue.';
  }
}


import { Routes } from '@angular/router';
import { ComposantListeGuides } from './components/guide-list/guide-list.component';
import { ComposantDetailGuide } from './components/guide-detail/guide-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/guides', pathMatch: 'full' },
  { path: 'guides', component: ComposantListeGuides },
  { path: 'guides/:id', component: ComposantDetailGuide },
  { path: '**', redirectTo: '/guides' }
];
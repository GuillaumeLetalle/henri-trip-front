export interface Activite {
  id: string;
  titre: string;
  description: string;
  heureDebut?: string;
  heureFin?: string;
  lieu?: string;
  ordre: number;
}

export interface Journee {
  id: string;
  numeroJour: number;
  titre: string;
  description?: string;
  activites: Activite[];
}

export interface Guide {
  id: string;
  titre: string;
  description: string;
  imageCouverture?: string;
  destination?: string;
  duree?: number;
  dateCreation?: Date;
  dateModification?: Date;
  journees: Journee[];
}

export interface GuideResume {
  id: string;
  titre: string;
  description: string;
  imageCouverture?: string;
  destination?: string;
  duree?: number;
}

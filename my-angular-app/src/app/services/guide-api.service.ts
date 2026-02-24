import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guide, GuideResume } from '../models/guide.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuideApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchGuides(): Observable<GuideResume[]> {
    return this.http.get<GuideResume[]>(`${this.baseUrl}/guides`);
  }

  fetchGuideById(id: string): Observable<Guide> {
    return this.http.get<Guide>(`${this.baseUrl}/guides/${id}`);
  }
}

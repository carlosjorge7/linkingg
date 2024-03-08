import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Profile } from '../models/profile';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);

  public getProfile(id: number): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiHost}users/${id}`);
  }

  public deleteProfile(id: string) {
    return this.http.delete(`${environment.apiHost}users/${id}`);
  }
}

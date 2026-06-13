import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import the internet tool
import { Observable } from 'rxjs';

// Match this interface exactly to your Java VaultItem model!
export interface VaultItem {
  id: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
  mediaType: string;
}

@Injectable({
  providedIn: 'root'
})
export class VaultService {
  // The exact home address of our Spring Boot Controller gateway
  private apiUrl = 'http://localhost:8080/api/vault';

  // Inject HttpClient via the constructor constructor
  constructor(private http: HttpClient) {}

  // 1. Fetch all items from the MySQL database through Java
  getVaultItems(): Observable<VaultItem[]> {
    return this.http.get<VaultItem[]>(this.apiUrl);
  }

  // 2. Push a new movie to be saved inside MySQL
  addToVault(item: VaultItem): Observable<VaultItem> {
    return this.http.post<VaultItem>(this.apiUrl, item);
  }

  // 3. Remove a movie permanently from the database using its ID
  removeFromVault(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
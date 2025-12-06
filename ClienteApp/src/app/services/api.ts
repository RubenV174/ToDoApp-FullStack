import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Tarea {
  id?: number
  titulo: string
  completada?: boolean
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'https://localhost:44385/api/tareas'

  private http = inject(HttpClient)

  constructor() { }

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl)
  }

  addTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea)
  }

  updateTarea(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, {})
  }

  deleteTarea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Api as ApiService, Tarea } from '../../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tareas',
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit {

  listaTareas: Tarea[] = []
  nuevaTareaTitulo: string = ''

  private apiService = inject(ApiService)

  ngOnInit(): void {
    this.cargarTareas()
  }

  cargarTareas() {
    this.apiService.getTareas().subscribe({
      next: (datos) => {
        this.listaTareas = datos
      },
      error: (err) => console.error("Error al conectar:", err)
    })
  }

  agregarTarea() {
    if (!this.nuevaTareaTitulo) return

    const nueva: Tarea = { titulo: this.nuevaTareaTitulo }

    this.apiService.addTarea(nueva).subscribe(() => {
      this.nuevaTareaTitulo = ''
      this.cargarTareas()
    })
  }

  cambiarEstado(tarea: Tarea) {
    if(tarea.id) {
      this.apiService.updateTarea(tarea.id).subscribe(() => {
        this.cargarTareas()
      })
    }
  }

  borrarTarea(id: number) {
    if(confirm("¿Borrar?")) {
      this.apiService.deleteTarea(id).subscribe(() => {
        this.cargarTareas()
      })
    }
  }
}

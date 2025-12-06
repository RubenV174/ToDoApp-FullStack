import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tareas } from "./components/tareas/tareas";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Tareas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ClienteApp');
}

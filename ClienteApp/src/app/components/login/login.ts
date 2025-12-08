import { Component } from '@angular/core';
import { Auth as AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { correo: '', password: '' }
  loginError = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => this.router.navigate(['/tareas']),
      error: (err) => {
        this.loginError = true
        console.error('Error de inicio de sesión:', err)
      }
    })
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // UPDATED: Matching your exact file structure!
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPageComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Please fill in both fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/vault']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid username or password.';
        console.error('Login error:', err);
      }
    });
  }
}
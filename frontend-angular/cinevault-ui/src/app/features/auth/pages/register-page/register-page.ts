import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  // REMEMBER: We are using the shortened file names!
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.scss']
})
export class RegisterPageComponent {
  credentials = { username: '', password: '', confirmPassword: '' };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password || !this.credentials.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Notice we drop the confirmPassword before sending to Java!
    const userPayload = {
      username: this.credentials.username,
      password: this.credentials.password
    };

    this.authService.register(userPayload).subscribe({
      next: () => {
        this.successMessage = 'Vault secured! Redirecting to login...';
        // Wait 2 seconds so they can read the success message, then move them
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        // This will display the "Username is already taken!" message from Java
        this.errorMessage = err.error || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }
}
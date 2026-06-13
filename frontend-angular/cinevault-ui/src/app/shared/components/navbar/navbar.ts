import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Removed FormsModule
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  isDarkMode: boolean = true;
  isLoggedIn$: any;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('cinevault-theme') || 'dark';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(savedTheme);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('cinevault-theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string): void {
    this.renderer.setAttribute(this.document.body, 'data-theme', theme);
  }
  
  onSearch(query: string): void {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query }, queryParamsHandling: 'merge' });
    }
  }

  // --- THE FIX: Route directly to your existing component ---
  toggleAdvancedFilter(): void {
    // Change '/filter' to whatever route path you actually gave your filter page in app.routes.ts!
    this.router.navigate(['/filter']); 
  }
}
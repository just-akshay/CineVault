import { Component, OnInit, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  isDarkMode: boolean = true;

  constructor(
    private renderer: Renderer2,
    // Safely look up the platform Document object in Angular standalone setups
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Check browser notebook storage for previous preferences, defaulting to Dark Mode
    const savedTheme = localStorage.getItem('cinevault-theme') || 'dark';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(savedTheme);
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    
    // Save to the browser notebook so it remembers on page refreshes
    localStorage.setItem('cinevault-theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string): void {
    // Safely switches <body data-theme="dark/light">
    this.renderer.setAttribute(this.document.body, 'data-theme', theme);
  }
}
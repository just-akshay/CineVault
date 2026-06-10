import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // 1. Import the routing tools

@Component({
  selector: 'app-navbar',
  standalone: true,
  // 2. Add them to the imports array so the HTML can use them
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'] 
})
export class NavbarComponent {
  // 3. State variable to track if the mobile menu is open or closed
  isMobileMenuOpen: boolean = false;

  // Flips the menu state (Open -> Closed, or Closed -> Open)
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Forces the menu to close (used when a user clicks a link)
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
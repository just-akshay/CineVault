import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
}) // 1. CLOSE THE CONFIGURATION BLOCK HERE
export class AppComponent {
  // 2. DECLARE THE CLASS BODY
}
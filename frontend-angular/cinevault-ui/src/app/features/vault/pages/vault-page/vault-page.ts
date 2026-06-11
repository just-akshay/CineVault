import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Add one more '../' to step cleanly out of the features tree into the app root
import { MediaCardComponent } from '../../../../shared/components/media-card/media-card';
@Component({
  selector: 'app-vault-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MediaCardComponent],
  templateUrl: './vault-page.html',
  styleUrls: ['./vault-page.scss']
})
export class VaultPageComponent implements OnInit {
  vaultItems: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadVault();
  }

  loadVault(): void {
    // Extract items safely and parse them into a live array
    this.vaultItems = JSON.parse(localStorage.getItem('cinevault_items') || '[]');
    this.cdr.detectChanges();
  }

  removeFromVault(eventId: number): void {
    // 1. Fetch your current locally cached vault assets array
    let vault = JSON.parse(localStorage.getItem('cinevault_items') || '[]');
    
    // 2. Filter out the targeted item using strict numeric evaluation
    vault = vault.filter((item: any) => Number(item.id) !== Number(eventId));
    
    // 3. Write the updated array back to your local storage partition
    localStorage.setItem('cinevault_items', JSON.stringify(vault));
    
    // 4. Trigger a clean re-render of your asset grid layout instantly
    this.loadVault(); 
  }
}
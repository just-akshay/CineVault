import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MediaCardComponent } from '../../../../shared/components/media-card/media-card';
import { VaultService,VaultItem } from '../../../../core/services/vault-service';

@Component({
  selector: 'app-vault-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MediaCardComponent],
  templateUrl: './vault-page.html',
  styleUrls: ['./vault-page.scss']
})
export class VaultPageComponent implements OnInit {
  vaultItems: VaultItem[] = [];

  constructor(
    private vaultService:VaultService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVault();
  }

  loadVault(): void {
    this.vaultService.getVaultItems().subscribe({
      // 2. Explicitly type 'data' as an array of VaultItems to satisfy strict mode
      next: (data: VaultItem[]) => {
        this.vaultItems = data;
        this.cdr.detectChanges();
      },
      // 3. Explicitly type 'err' as 'any' to satisfy strict mode
      error: (err: any) => {
        console.error('Failed to get database vault items:', err);
      }
    });
  }

  removeFromVault(eventId: number): void {
    this.vaultService.removeFromVault(eventId).subscribe({
      next: () => {
        console.log(`Successfully deleted item ${eventId} from database`);
        this.loadVault(); 
      },
      // 4. Explicitly type 'err' as 'any' here as well
      error: (err: any) => {
        console.error('Failed to delete item from database:', err);
      }
    });
  }
}
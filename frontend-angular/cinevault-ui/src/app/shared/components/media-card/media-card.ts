import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './media-card.html',
  styleUrls: ['./media-card.scss']
})
export class MediaCardComponent {
  // Feed this card any standard movie/tv object data structure
  @Input({ required: true }) movie: any;
  
  // Emits the item's unique ID back up to the parent vault page for deletion logic
  @Output() remove = new EventEmitter<number>();

  onRemoveClick(event: Event): void {
    // CRUCIAL: Prevents the click from cascading up to the <a> tag
    // This stops the app from navigating to the details page when you just want to delete the item!
    event.stopPropagation();
    event.preventDefault();
    
    // Bubble the deletion action up to the parent manager (Vault Page)
    this.remove.emit(this.movie.id);
  }
}
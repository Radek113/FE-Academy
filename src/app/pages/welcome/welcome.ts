import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  protected readonly features = [
    {
      icon: 'photo_library',
      title: 'Browse',
      text: 'Explore a curated collection of photographs.',
    },
    {
      icon: 'filter_alt',
      title: 'Filter',
      text: 'Narrow the gallery down by tags and categories.',
    },
    { icon: 'person', title: 'About', text: 'Learn more about the photographer behind the lens.' },
  ];
}

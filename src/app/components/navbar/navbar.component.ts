import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = false;
  username = 'John Doe';
  bookingCount = 2;
  
  navItems = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Movies', path: '/movies', icon: 'movie' },
    { label: 'Theatres', path: '/theatres', icon: 'theaters' },
    { label: 'My Bookings', path: '/my-bookings', icon: 'confirmation_number' }
  ];

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }
}
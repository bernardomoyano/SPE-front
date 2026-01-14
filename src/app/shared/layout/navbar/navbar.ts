import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Logo } from '../../components/logo/logo';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, Logo],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  userName = signal<string>('Usuario');
  userRole = signal<string>('');
  isMobileMenuOpen = signal<boolean>(false);
  menuItems = signal<MenuItem[]>([]);

  constructor(
    private menuService: MenuService,
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadMenuItems();
  }

  loadUserData(): void {
    const userData = this.storageService.getUserData();
    if (userData) {
      this.userRole.set(userData.roleName || '');
      this.userName.set(userData.name || 'Usuario');
    }
  }

  loadMenuItems(): void {
    const userRole = this.userRole();
    this.menuItems.set(this.menuService.getMenuItems(userRole));
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  navigateTo(route: string): void {
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

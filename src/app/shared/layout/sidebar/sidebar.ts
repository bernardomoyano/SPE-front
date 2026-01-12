import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Logo } from '../../components/logo/logo';
import { StorageService } from '../../../services/storage.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, Logo],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  userRole: string = '';
  userName: string = 'Usuario';
  menuItems: MenuItem[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadMenuItems();
  }

  loadUserData(): void {
    const userData = this.storageService.getUserData();
    if (userData) {
      this.userRole = userData.roleName || '';
      this.userName = userData.name || 'Usuario';
    }
  }

  loadMenuItems(): void {
    if (this.userRole === 'COACH') {
      this.menuItems = [
        { label: 'Planificaciones', icon: 'pi pi-calendar', route: '/planificaciones' },
        { label: 'Atletas', icon: 'pi pi-users', route: '/atletas' },
        { label: 'Ejercicios', icon: 'pi pi-list', route: '/ejercicios' },
        { label: 'Mi Perfil', icon: 'pi pi-user', route: '/mi-perfil' }
      ];
    }
    // Agregar más roles en el futuro (STUDENT, etc.)
  }
}

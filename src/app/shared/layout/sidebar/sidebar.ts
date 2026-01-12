import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    // Por ahora solo para COACH, se puede expandir para otros roles
    this.menuItems = [
      { label: 'Planificaciones', icon: 'pi pi-calendar', route: '/planificaciones' },
      { label: 'Atletas', icon: 'pi pi-users', route: '/atletas' },
      { label: 'Ejercicios', icon: 'pi pi-list', route: '/ejercicios' },
      { label: 'Mi Perfil', icon: 'pi pi-user', route: '/mi-perfil' }
    ];
  }
}

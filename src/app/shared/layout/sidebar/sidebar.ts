import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuService, MenuItem } from '../../../services/menu.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  menuItems: MenuItem[] = [];
  openGroups = new Set<string>();

  constructor(
    private menuService: MenuService,
    private storageService: StorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems(): void {
    const userData = this.storageService.getUserData();
    const userRole = userData?.roleName;
    this.menuItems = this.menuService.getMenuItems(userRole);

    this.menuItems
      .filter(item => item.children?.some(child => this.isRouteActive(child.route)))
      .forEach(item => this.openGroups.add(item.label));
  }

  toggleGroup(label: string): void {
    if (this.openGroups.has(label)) {
      this.openGroups.delete(label);
      return;
    }

    this.openGroups.add(label);
  }

  isGroupOpen(label: string): boolean {
    return this.openGroups.has(label);
  }

  isGroupActive(item: MenuItem): boolean {
    return item.children?.some(child => this.isRouteActive(child.route)) ?? false;
  }

  isRouteActive(route?: string): boolean {
    return !!route && this.router.url.startsWith(route);
  }
}

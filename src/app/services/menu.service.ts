import { Injectable } from '@angular/core';

export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles?: string[];
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly menuItems: MenuItem[] = [
    {
      label: 'Planificaciones',
      icon: 'pi pi-calendar',
      route: '/planificaciones',
      roles: ['COACH']
    },
    {
      label: 'Atletas',
      icon: 'pi pi-users',
      route: '/atletas',
      roles: ['COACH']
    },
    {
      label: 'Pagos',
      icon: 'pi pi-credit-card',
      roles: ['COACH'],
      children: [
        {
          label: 'Pagos pendientes',
          icon: 'pi pi-clock',
          route: '/pagos-pendientes',
          roles: ['COACH']
        },
        {
          label: 'Todos los pagos',
          icon: 'pi pi-list',
          route: '/pagos',
          roles: ['COACH']
        }
      ]
    },
    {
      label: 'Pagos',
      icon: 'pi pi-credit-card',
      route: '/pagos',
      roles: ['STUDENT']
    },
    {
      label: 'Ejercicios',
      icon: 'pi pi-list',
      route: '/ejercicios',
      roles: ['COACH']
    },
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      route: '/mi-perfil',
      roles: ['COACH', 'STUDENT']
    },
    {
      label: 'Mis Planificaciones',
      icon: 'pi pi-calendar',
      route: '/mis-planificaciones',
      roles: ['STUDENT']
    }
  ];

  constructor() {}

  getMenuItems(userRole?: string): MenuItem[] {
    if (!userRole) {
      return [];
    }

    return this.menuItems
      .filter(item => this.canShow(item, userRole))
      .map(item => ({
        ...item,
        children: item.children?.filter(child => this.canShow(child, userRole))
      }));
  }

  getAllMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }

  private canShow(item: MenuItem, userRole: string): boolean {
    return !item.roles || item.roles.length === 0 || item.roles.includes(userRole);
  }
}

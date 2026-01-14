import { Injectable } from '@angular/core';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[]; // Roles que pueden ver este item (opcional)
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
      label: 'Ejercicios',
      icon: 'pi pi-list',
      route: '/ejercicios',
      roles: ['COACH']
    },
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      route: '/mi-perfil',
      roles: ['COACH', 'STUDENT'] // Preparado para futuro rol STUDENT
    }
  ];

  constructor() {}

  /**
   * Obtiene los items del menú según el rol del usuario
   * @param userRole Rol del usuario actual
   * @returns Array de items del menú filtrados por rol
   */
  getMenuItems(userRole?: string): MenuItem[] {
    if (!userRole) {
      return [];
    }

    return this.menuItems.filter(item => {
      // Si no tiene roles definidos, es visible para todos
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      // Si tiene roles definidos, verificar si el usuario tiene acceso
      return item.roles.includes(userRole);
    });
  }

  /**
   * Obtiene todos los items del menú (para administradores o configuración)
   * @returns Array completo de items del menú
   */
  getAllMenuItems(): MenuItem[] {
    return [...this.menuItems];
  }
}

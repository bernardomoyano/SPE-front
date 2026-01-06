import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

  constructor() {}

  /**
   * Guarda el token de autenticación en localStorage
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error al guardar el token:', error);
    }
  }

  /**
   * Obtiene el token de autenticación desde localStorage
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }

  /**
   * Elimina el token de autenticación de localStorage
   */
  removeToken(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error al eliminar el token:', error);
    }
  }

  /**
   * Guarda los datos del usuario en localStorage
   */
  setUserData(userData: any): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
    }
  }

  /**
   * Obtiene los datos del usuario desde localStorage
   */
  getUserData(): any | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  /**
   * Elimina los datos del usuario de localStorage
   */
  removeUserData(): void {
    try {
      localStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Error al eliminar datos del usuario:', error);
    }
  }

  /**
   * Limpia todos los datos de autenticación
   */
  clearAll(): void {
    this.removeToken();
    this.removeUserData();
  }

  /**
   * Verifica si existe un token guardado
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
}

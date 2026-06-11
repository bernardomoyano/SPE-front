import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, LoginResponse, UserData } from '../models/auth.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7281/api/auth';
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Cargar usuario si existe token al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Realiza el login del usuario
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        })
      );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google/login`;
  }

  completeGoogleLogin(token: string): void {
    const payload = this.decodeJwtPayload(token);
    const userData: UserData = {
      userId: Number(payload['sub'] ?? 0),
      name: payload['name'] ?? payload['email'] ?? '',
      email: payload['email'] ?? '',
      roleName: payload['role'] ?? '',
      token
    };

    this.storageService.setToken(token);
    this.storageService.setUserData(userData);
    this.currentUserSubject.next(userData);
  }

  /**
   * Guarda la sesión del usuario
   */
  private setSession(loginData: LoginResponse): void {
    const userData: UserData = {
      userId: loginData.userId,
      name: loginData.name,
      email: loginData.email,
      roleName: loginData.roleName,
      token: loginData.token
    };

    this.storageService.setToken(loginData.token);
    this.storageService.setUserData(userData);
    this.currentUserSubject.next(userData);
  }

  private decodeJwtPayload(token: string): Record<string, any> {
    const payload = token.split('.')[1];
    if (!payload) {
      return {};
    }

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(normalizedPayload.padEnd(normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4, '='));

    return JSON.parse(decodedPayload);
  }

  /**
   * Carga el usuario desde localStorage al iniciar la aplicación
   */
  private loadUserFromStorage(): void {
    const userData = this.storageService.getUserData();
    if (userData) {
      this.currentUserSubject.next(userData);
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.storageService.clearAll();
    this.currentUserSubject.next(null);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.storageService.hasToken();
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): UserData | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    return this.storageService.getToken();
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.roleName : null;
  }
}

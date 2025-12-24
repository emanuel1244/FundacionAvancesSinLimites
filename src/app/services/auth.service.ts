import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // Credenciales de admin (en producción esto estaría en una base de datos)
  private adminCredentials = {
    username: 'admin',
    password: 'fundacion2024',
    user: {
      id: '1',
      username: 'admin',
      role: 'admin' as const,
      name: 'Administrador FASL'
    }
  };

  constructor() {
    // Verificar si hay una sesión guardada
    this.checkStoredSession();
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  login(username: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    return new Observable(observer => {
      // Simular delay de autenticación
      setTimeout(() => {
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
          this.currentUserSubject.next(this.adminCredentials.user);
          this.isLoggedInSubject.next(true);
          
          // Guardar sesión en localStorage
          localStorage.setItem('fasl_user', JSON.stringify(this.adminCredentials.user));
          localStorage.setItem('fasl_session', 'active');
          
          observer.next({
            success: true,
            message: 'Inicio de sesión exitoso',
            user: this.adminCredentials.user
          });
        } else {
          observer.next({
            success: false,
            message: 'Credenciales incorrectas'
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    
    // Limpiar localStorage
    localStorage.removeItem('fasl_user');
    localStorage.removeItem('fasl_session');
  }

  private checkStoredSession(): void {
    const storedUser = localStorage.getItem('fasl_user');
    const storedSession = localStorage.getItem('fasl_session');
    
    if (storedUser && storedSession === 'active') {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
      } catch (error) {
        // Si hay error al parsear, limpiar storage
        this.logout();
      }
    }
  }
}
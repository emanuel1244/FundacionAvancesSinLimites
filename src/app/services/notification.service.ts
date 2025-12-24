import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);

  constructor() {
    // Simular notificaciones automáticas cada 30 segundos
    this.startAutoNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const current = this.notifications$.value;
    this.notifications$.next([newNotification, ...current]);
    this.updateUnreadCount();

    // Auto-cerrar si está configurado
    if (newNotification.autoClose) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration || 5000);
    }
  }

  markAsRead(id: string): void {
    const current = this.notifications$.value;
    const updated = current.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications$.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const current = this.notifications$.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notifications$.next(updated);
    this.updateUnreadCount();
  }

  removeNotification(id: string): void {
    const current = this.notifications$.value;
    const updated = current.filter(n => n.id !== id);
    this.notifications$.next(updated);
    this.updateUnreadCount();
  }

  clearAll(): void {
    this.notifications$.next([]);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const unread = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(unread);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private startAutoNotifications(): void {
    // Agregar notificación inicial
    setTimeout(() => {
      this.addNotification({
        title: 'Sistema Activado',
        message: 'Panel de notificaciones y gestión de noticias listo.',
        type: 'success',
        autoClose: true,
        duration: 4000
      });
    }, 2000);

    // Notificaciones automáticas cada 60 segundos (más espaciadas)
    setInterval(() => {
      const messages = [
        {
          title: 'Nueva Noticia Disponible',
          message: 'Se ha publicado una nueva noticia en nuestro sitio web.',
          type: 'info' as const
        },
        {
          title: 'Evento Próximo',
          message: 'Recordatorio: Taller de emprendimiento mañana a las 2:00 PM.',
          type: 'warning' as const
        },
        {
          title: 'Donación Recibida',
          message: 'Nueva donación de $50.000 COP recibida. ¡Gracias por el apoyo!',
          type: 'success' as const
        },
        {
          title: 'Nuevo Beneficiario',
          message: 'Se ha registrado un nuevo beneficiario en nuestros programas.',
          type: 'success' as const
        }
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      this.addNotification(randomMessage);
    }, 60000); // Cada 60 segundos
  }
}
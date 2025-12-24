import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  image?: string;
  category: 'evento' | 'donacion' | 'beneficiario' | 'general' | 'logro';
  priority: 'alta' | 'media' | 'baja';
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  author: string;
  views: number;
  featured: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private newsSubject = new BehaviorSubject<NewsItem[]>([]);
  private storageKey = 'fasl_news_database';

  constructor() {
    this.loadNewsFromStorage();
    this.initializeSampleData();
  }

  getAllNews(): Observable<NewsItem[]> {
    return this.newsSubject.asObservable();
  }

  getPublishedNews(): Observable<NewsItem[]> {
    return this.newsSubject.pipe(
      map(news => news.filter(item => item.status === 'published').sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    );
  }

  getFeaturedNews(): Observable<NewsItem[]> {
    return this.newsSubject.pipe(
      map(news => news.filter(item => item.featured && item.status === 'published').slice(0, 3))
    );
  }

  getNewsByCategory(category: string): Observable<NewsItem[]> {
    return this.newsSubject.pipe(
      map(news => news.filter(item => item.category === category && item.status === 'published'))
    );
  }

  getNewsById(id: string): Observable<NewsItem | undefined> {
    return this.newsSubject.pipe(
      map(news => {
        const item = news.find(n => n.id === id);
        if (item) {
          // Incrementar vistas
          item.views++;
          this.saveNewsToStorage();
        }
        return item;
      })
    );
  }

  createNews(newsData: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Observable<NewsItem> {
    return new Observable(observer => {
      setTimeout(() => {
        const newNews: NewsItem = {
          ...newsData,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0
        };

        const currentNews = this.newsSubject.value;
        const updatedNews = [newNews, ...currentNews];
        
        this.newsSubject.next(updatedNews);
        this.saveNewsToStorage();
        
        observer.next(newNews);
        observer.complete();
      }, 500);
    });
  }

  updateNews(id: string, updates: Partial<NewsItem>): Observable<NewsItem | null> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentNews = this.newsSubject.value;
        const index = currentNews.findIndex(n => n.id === id);
        
        if (index !== -1) {
          const updatedNews = {
            ...currentNews[index],
            ...updates,
            updatedAt: new Date()
          };
          
          currentNews[index] = updatedNews;
          this.newsSubject.next([...currentNews]);
          this.saveNewsToStorage();
          
          observer.next(updatedNews);
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
  }

  deleteNews(id: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentNews = this.newsSubject.value;
        const filteredNews = currentNews.filter(n => n.id !== id);
        
        if (filteredNews.length !== currentNews.length) {
          this.newsSubject.next(filteredNews);
          this.saveNewsToStorage();
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 300);
    });
  }

  searchNews(query: string): Observable<NewsItem[]> {
    return this.newsSubject.pipe(
      map(news => news.filter(item => 
        item.status === 'published' && (
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          item.summary.toLowerCase().includes(query.toLowerCase())
        )
      ))
    );
  }

  private loadNewsFromStorage(): void {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const news = JSON.parse(stored).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
        this.newsSubject.next(news);
      } catch (error) {
        console.error('Error loading news from storage:', error);
        this.newsSubject.next([]);
      }
    }
  }

  private saveNewsToStorage(): void {
    const news = this.newsSubject.value;
    localStorage.setItem(this.storageKey, JSON.stringify(news));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeSampleData(): void {
    // Solo inicializar si no hay datos
    if (this.newsSubject.value.length === 0) {
      const sampleNews: NewsItem[] = [
        {
          id: '1',
          title: 'Nuevo Programa de Rehabilitación Integral',
          summary: 'Lanzamos un innovador programa que beneficiará a más de 100 personas con discapacidad.',
          content: 'La Fundación Avanza Sin Límites se complace en anunciar el lanzamiento de nuestro nuevo programa de rehabilitación integral, diseñado específicamente para personas con discapacidad sensorial, motora e intelectual. Este programa innovador incluye terapias especializadas, talleres de desarrollo personal y actividades de integración social que beneficiarán directamente a más de 100 personas de nuestra comunidad.',
          image: 'assets/fundacion1.jpeg',
          category: 'general',
          priority: 'alta',
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 días atrás
          updatedAt: new Date(Date.now() - 86400000 * 2),
          author: 'Administrador FASL',
          views: 45,
          featured: true
        },
        {
          id: '2',
          title: 'Taller de Emprendimiento Exitoso',
          summary: '25 beneficiarios completaron exitosamente nuestro taller de emprendimiento.',
          content: 'Con gran orgullo compartimos los resultados de nuestro último taller de emprendimiento, donde 25 beneficiarios desarrollaron habilidades empresariales y presentaron proyectos innovadores. Durante 8 semanas, los participantes aprendieron sobre planificación de negocios, marketing digital y gestión financiera, culminando con la presentación de sus propuestas de emprendimiento.',
          image: 'assets/fundacion2.jpeg',
          category: 'evento',
          priority: 'media',
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 días atrás
          updatedAt: new Date(Date.now() - 86400000 * 5),
          author: 'Administrador FASL',
          views: 32,
          featured: true
        },
        {
          id: '3',
          title: 'Donación Significativa Recibida',
          summary: 'Recibimos una generosa donación que nos permitirá expandir nuestros programas.',
          content: 'Gracias a la generosidad de nuestros donantes, hemos recibido una contribución significativa que nos permitirá expandir nuestros programas de atención y llegar a más familias necesitadas. Esta donación será destinada a la adquisición de equipos especializados y la implementación de nuevos talleres de capacitación.',
          image: 'assets/fundacion3.jpeg',
          category: 'donacion',
          priority: 'alta',
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 7), // 1 semana atrás
          updatedAt: new Date(Date.now() - 86400000 * 7),
          author: 'Administrador FASL',
          views: 67,
          featured: true
        },
        {
          id: '4',
          title: 'Nuevo Beneficiario: Historia de Superación',
          summary: 'Conoce la inspiradora historia de María, nuestra nueva beneficiaria.',
          content: 'María, de 28 años, se unió recientemente a nuestra fundación después de un accidente que cambió su vida. Su determinación y espíritu positivo son un ejemplo para todos nosotros. A través de nuestros programas de rehabilitación, María ha logrado recuperar su independencia y ahora participa activamente en nuestros talleres de emprendimiento.',
          image: 'assets/fundacion5.jpeg',
          category: 'beneficiario',
          priority: 'media',
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 10), // 10 días atrás
          updatedAt: new Date(Date.now() - 86400000 * 10),
          author: 'Administrador FASL',
          views: 28,
          featured: false
        },
        {
          id: '5',
          title: 'Reconocimiento Nacional Recibido',
          summary: 'La fundación recibe reconocimiento por su labor social excepcional.',
          content: 'Nos enorgullece anunciar que la Fundación Avanza Sin Límites ha sido reconocida a nivel nacional por su excepcional labor en pro de las personas con discapacidad. Este reconocimiento valida nuestro compromiso y nos motiva a continuar trabajando por la inclusión y el bienestar de nuestra comunidad.',
          image: 'assets/fundacion6.jpeg',
          category: 'logro',
          priority: 'alta',
          status: 'published',
          createdAt: new Date(Date.now() - 86400000 * 14), // 2 semanas atrás
          updatedAt: new Date(Date.now() - 86400000 * 14),
          author: 'Administrador FASL',
          views: 89,
          featured: false
        }
      ];

      this.newsSubject.next(sampleNews);
      this.saveNewsToStorage();
    }
  }
}
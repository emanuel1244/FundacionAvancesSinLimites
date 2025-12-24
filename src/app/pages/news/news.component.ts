import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NewsService, NewsItem } from '../../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  allNews: NewsItem[] = [];
  featuredNews: NewsItem[] = [];
  isLoading = true;
  selectedCategory = 'all';

  categories = [
    { value: 'all', label: 'Todas', icon: 'fas fa-th-large' },
    { value: 'general', label: 'General', icon: 'fas fa-newspaper' },
    { value: 'evento', label: 'Eventos', icon: 'fas fa-calendar-alt' },
    { value: 'donacion', label: 'Donaciones', icon: 'fas fa-heart' },
    { value: 'beneficiario', label: 'Beneficiarios', icon: 'fas fa-users' },
    { value: 'logro', label: 'Logros', icon: 'fas fa-trophy' }
  ];

  constructor(
    private newsService: NewsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNews();
    this.loadFeaturedNews();
  }

  loadNews(): void {
    this.isLoading = true;
    this.newsService.getPublishedNews().subscribe({
      next: (news) => {
        this.allNews = news;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.isLoading = false;
      }
    });
  }

  loadFeaturedNews(): void {
    this.newsService.getFeaturedNews().subscribe({
      next: (news) => {
        this.featuredNews = news;
      }
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredNews(): NewsItem[] {
    if (this.selectedCategory === 'all') {
      return this.allNews;
    }
    return this.allNews.filter(news => news.category === this.selectedCategory);
  }

  getCategoryInfo(category: string) {
    return this.categories.find(cat => cat.value === category) || this.categories[0];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return this.formatDate(date);
  }

  readNews(news: NewsItem): void {
    // Incrementar vistas y navegar a detalle (si implementas vista detallada)
    this.newsService.getNewsById(news.id).subscribe();
    // Por ahora solo mostrar alert con el contenido
    alert(`${news.title}\n\n${news.content}`);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
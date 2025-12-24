import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { NewsService, NewsItem } from '../../services/news.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  allNews: NewsItem[] = [];
  filteredNews: NewsItem[] = [];
  
  // Form data
  newsForm: Partial<NewsItem> = {
    title: '',
    summary: '',
    content: '',
    category: 'general',
    priority: 'media',
    status: 'draft',
    featured: false,
    image: ''
  };

  // UI State
  showCreateForm = false;
  editingNews: NewsItem | null = null;
  isLoading = false;
  searchQuery = '';
  selectedCategory = 'all';
  selectedStatus = 'all';

  // Statistics
  stats = {
    total: 0,
    published: 0,
    drafts: 0,
    totalViews: 0
  };

  categories = [
    { value: 'general', label: 'General' },
    { value: 'evento', label: 'Evento' },
    { value: 'donacion', label: 'Donación' },
    { value: 'beneficiario', label: 'Beneficiario' },
    { value: 'logro', label: 'Logro' }
  ];

  priorities = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ];

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticación
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (!user || !this.authService.isAdmin()) {
        this.router.navigate(['/admin-login']);
        return;
      }
    });

    // Cargar noticias
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getAllNews().subscribe(news => {
      this.allNews = news;
      this.applyFilters();
      this.calculateStats();
    });
  }

  applyFilters(): void {
    let filtered = [...this.allNews];

    // Filtro por búsqueda
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(query) ||
        news.content.toLowerCase().includes(query) ||
        news.summary.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === this.selectedCategory);
    }

    // Filtro por estado
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(news => news.status === this.selectedStatus);
    }

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.filteredNews = filtered;
  }

  calculateStats(): void {
    this.stats = {
      total: this.allNews.length,
      published: this.allNews.filter(n => n.status === 'published').length,
      drafts: this.allNews.filter(n => n.status === 'draft').length,
      totalViews: this.allNews.reduce((sum, n) => sum + n.views, 0)
    };
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  showCreateNewsForm(): void {
    this.showCreateForm = true;
    this.editingNews = null;
    this.resetForm();
  }

  editNews(news: NewsItem): void {
    this.editingNews = news;
    this.showCreateForm = true;
    this.newsForm = { ...news };
  }

  resetForm(): void {
    this.newsForm = {
      title: '',
      summary: '',
      content: '',
      category: 'general',
      priority: 'media',
      status: 'draft',
      featured: false,
      image: ''
    };
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingNews = null;
    this.resetForm();
  }

  saveNews(): void {
    if (!this.newsForm.title?.trim() || !this.newsForm.content?.trim()) {
      this.notificationService.addNotification({
        title: 'Error',
        message: 'El título y contenido son obligatorios',
        type: 'error'
      });
      return;
    }

    this.isLoading = true;

    const newsData = {
      ...this.newsForm,
      author: this.currentUser?.name || 'Admin'
    } as Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'views'>;

    if (this.editingNews) {
      // Actualizar noticia existente
      this.newsService.updateNews(this.editingNews.id, newsData).subscribe({
        next: (updatedNews) => {
          this.isLoading = false;
          if (updatedNews) {
            this.notificationService.addNotification({
              title: 'Noticia Actualizada',
              message: `"${updatedNews.title}" ha sido actualizada exitosamente`,
              type: 'success'
            });
            this.cancelForm();
            this.loadNews();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.addNotification({
            title: 'Error',
            message: 'No se pudo actualizar la noticia',
            type: 'error'
          });
        }
      });
    } else {
      // Crear nueva noticia
      this.newsService.createNews(newsData).subscribe({
        next: (newNews) => {
          this.isLoading = false;
          this.notificationService.addNotification({
            title: 'Noticia Creada',
            message: `"${newNews.title}" ha sido creada exitosamente`,
            type: 'success'
          });
          this.cancelForm();
          this.loadNews();
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.addNotification({
            title: 'Error',
            message: 'No se pudo crear la noticia',
            type: 'error'
          });
        }
      });
    }
  }

  deleteNews(news: NewsItem): void {
    if (confirm(`¿Estás seguro de eliminar "${news.title}"?`)) {
      this.newsService.deleteNews(news.id).subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.addNotification({
              title: 'Noticia Eliminada',
              message: `"${news.title}" ha sido eliminada`,
              type: 'success'
            });
            this.loadNews();
          }
        },
        error: (error) => {
          this.notificationService.addNotification({
            title: 'Error',
            message: 'No se pudo eliminar la noticia',
            type: 'error'
          });
        }
      });
    }
  }

  togglePublishStatus(news: NewsItem): void {
    const newStatus = news.status === 'published' ? 'draft' : 'published';
    this.newsService.updateNews(news.id, { status: newStatus }).subscribe({
      next: (updatedNews) => {
        if (updatedNews) {
          const action = newStatus === 'published' ? 'publicada' : 'despublicada';
          this.notificationService.addNotification({
            title: 'Estado Actualizado',
            message: `"${updatedNews.title}" ha sido ${action}`,
            type: 'info'
          });
          this.loadNews();
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
  }

  getPriorityLabel(priority: string): string {
    const pri = this.priorities.find(p => p.value === priority);
    return pri ? pri.label : priority;
  }
}
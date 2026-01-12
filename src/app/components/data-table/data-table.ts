import { Component, Input, Output, EventEmitter, HostListener, signal, Directive, ElementRef, EventEmitter as EventEmitterDirective, Output as OutputDirective } from '@angular/core';
import { CommonModule } from '@angular/common';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.clickOutside.emit();
    }
  }
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  action: (item: any) => void;
}

export interface TableConfig {
  columns: TableColumn[];
  actions?: TableAction[];
  showPagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  showCardsOnMobile?: boolean;
  cardTitleKey?: string;
  cardSubtitleKey?: string;
  cardDescriptionKeys?: string[];
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTableComponent {
  @Input() config!: TableConfig;
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() currentPage = 1;
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();

  currentSort: { column: string; direction: 'asc' | 'desc' } | null = null;
  isMobile = signal<boolean>(false);
  showActionsMenu = signal<{ [key: string]: boolean }>({});

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile.set(window.innerWidth <= 768);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / (this.config.pageSize || 10));
  }

  get paginatedData(): any[] {
    if (!this.config.showPagination) {
      return this.data;
    }

    const pageSize = this.config.pageSize || 10;
    const startIndex = (this.currentPage - 1) * pageSize;
    return this.data.slice(startIndex, startIndex + pageSize);
  }

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter(item => item !== '...') as number[];
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (this.currentSort?.column === column.key && this.currentSort.direction === 'asc') {
      direction = 'desc';
    }

    this.currentSort = { column: column.key, direction };
    this.sortChange.emit(this.currentSort);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';

    if (this.currentSort?.column !== column.key) {
      return 'pi pi-sort';
    }

    return this.currentSort.direction === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down';
  }

  getActionButtonClass(action: TableAction): string {
    const baseClass = 'data-table__action-btn';
    const colorClass = action.color ? `${baseClass}--${action.color}` : '';
    return `${baseClass} ${colorClass}`.trim();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  toggleActionsMenu(itemId: any): void {
    const id = itemId.id || itemId;
    this.showActionsMenu.update(menu => ({
      ...menu,
      [id]: !menu[id]
    }));
  }

  closeActionsMenu(itemId: any): void {
    const id = itemId.id || itemId;
    this.showActionsMenu.update(menu => ({
      ...menu,
      [id]: false
    }));
  }

  executeAction(action: TableAction, item: any): void {
    action.action(item);
    this.closeActionsMenu(item);
  }

  getColumnLabel(key: string): string {
    const column = this.config.columns.find(col => col.key === key);
    return column ? column.label : key;
  }
}

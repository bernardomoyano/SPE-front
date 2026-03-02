import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-week-tabs',
  imports: [CommonModule],
  templateUrl: './week-tabs.html',
  styleUrl: './week-tabs.scss',
})
export class WeekTabsComponent {
  @Input() totalWeeks: number = 0;
  @Input() activeWeek: number = 1;
  @Output() weekChange = new EventEmitter<number>();

  selectWeek(week: number): void {
    this.weekChange.emit(week);
  }

  get weeks(): number[] {
    return Array.from({ length: this.totalWeeks }, (_, i) => i + 1);
  }
}

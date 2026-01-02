import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() label: string = '';
  @Input() type: string = 'button';
  @Input() variant: string = 'primary'; // 'primary' or 'secondary'
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
}

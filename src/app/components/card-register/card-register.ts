import { Component, Input } from '@angular/core';
import { PrimeIcons, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-card-register',
  imports: [],
  templateUrl: './card-register.html',
  styleUrl: './card-register.scss',
})
export class CardRegister {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
}

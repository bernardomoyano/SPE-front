import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moneyArg',
  standalone: true
})
export class MoneyArgPipe implements PipeTransform {
  transform(amount: number | null | undefined, currency = 'ARS'): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency || 'ARS'
    }).format(amount ?? 0);
  }
}

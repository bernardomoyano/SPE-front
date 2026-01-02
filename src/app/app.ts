import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengModule } from './shared/primeng.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PrimengModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'front';
}

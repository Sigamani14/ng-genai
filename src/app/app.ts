import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GenerateTextComponent } from '../generate-text-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GenerateTextComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-genai');
}

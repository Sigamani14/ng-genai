
import { Component, inject, signal } from "@angular/core";
import { GenAIService } from "./genai.service";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-generate-text',
  imports: [FormsModule],
  template: `
    <div class="container">
      <h2>AI Text Generator</h2>
      
      <form #textForm="ngForm" (ngSubmit)="generateResponse()" class="form">
        <div class="input-group">
          <label for="prompt">Enter your prompt:</label>
          <textarea 
            id="prompt"
            name="prompt"
            [(ngModel)]="prompt"
            required
            placeholder="Type your prompt here..."
            rows="4"
            class="textarea">
          </textarea>
        </div>
        
        <button 
          type="submit" 
          [disabled]="!textForm.form.valid"
          class="submit-btn">
          Generate Response
        </button>
      </form>
      @let response = generatedResponse();
      <div class="response-section">
          <h3>Response:</h3>
          <div 
              [class.response-box]="response.error === null"
              [class.error-box]="response.error !== null">
              {{ response.text }}
          </div>
      </div>
    </div>
  `,
})
export class GenerateTextComponent {
    readonly #genAI = inject(GenAIService);
    prompt = signal('');
    generatedResponse = signal<{text: string, error: string | null}>({
        text: '', 
        error: null,
    });

    generateResponse() {
        // I would be very very happy to do this via resources
        // but they do not yet support POST requests
        // P.S. read more about resources in my article: https://www.angularspace.com/meet-http-resource/
        this.#genAI.generateContent(this.prompt()).subscribe({
            next: (response) => this.generatedResponse.set({
                text: response, error: null,
            }),
            error: () => this.generatedResponse.set({
                text: '', error: 'Error generating text',
            })
        });
    }
  
}

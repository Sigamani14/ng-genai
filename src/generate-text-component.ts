
import { Component, inject, signal } from "@angular/core";
import { GenAIService } from "./genai.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'ngx-markdown';
import { finalize } from "rxjs";


@Component({
    selector: 'app-generate-text',
  imports: [FormsModule, CommonModule, MarkdownModule ],
  styles:[`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .form {
      display: flex;
      flex-direction: column;
    }
    .input-group {
      margin-bottom: 15px;
    }
    label {
      margin-bottom: 5px;
      font-weight: bold;
    }
    .textarea {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .submit-btn {
      padding: 10px 20px;
      font-size: 16px;
      color: #fff;
      background-color: #007bff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .submit-btn[disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top: 2px solid #000;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
  `],
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
          [disabled]="!textForm.form.valid || loading()"
          class="submit-btn">
          {{ loading() ? 'Generating...' : 'Generate Text' }}
          @if(loading()) 
          { 
            <span class="spinner"></span>
          }
        </button>      
      </form>
      @let response = generatedResponse();
      @if(!loading() && response.text) {
      <div class="response-section">
          <h3>Response:</h3>
          
          <div
              [class.response-box]="response.error === null"
              [class.error-box]="response.error !== null">
             <markdown [data]="response.text"></markdown>
          </div>
          
      </div>
      }
    </div>
  `
})
export class GenerateTextComponent {
  loading = signal(false);
    readonly #genAI = inject(GenAIService);
    prompt = signal('');
    generatedResponse = signal<{text: string, error: string | null}>({
        text: '', 
        error: null,
    });

    generateResponse() {
        this.loading.set(true);
        this.#genAI.generateContent(this.prompt()).pipe(
          finalize(()=> this.loading.set(false))
        ).subscribe({
            next: (response) => this.generatedResponse.set({
                text: response, error: null,
        }),
            error: () => this.generatedResponse.set({
                text: '', error: 'Error generating text',
            }),
            complete: () => this.loading.set(false),
        });
    }
  
}

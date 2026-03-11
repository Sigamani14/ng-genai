import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "./environment";

export type GeminiResponse = {
    candidates: {
        content: {
            parts: {
                text: string
            }[]
        }
    }[];
}

@Injectable({providedIn: 'root'})
export class GenAIService {
    readonly #http = inject(HttpClient);

    endpoint = environment.Node_API_Endpoint;
    
    generateContent(prompt: string) {
        return this.#http.post<GeminiResponse>(this.endpoint, {prompt}).pipe(
            // map the response to just return the generated text
            map(
                response => response.candidates[0]?.content.parts[0].text || 'No response'
            )
        )
    }
}

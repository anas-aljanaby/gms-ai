import { api } from './api';

type AiResponseMimeType = 'application/json' | 'text/plain' | string;

interface GenerateAiContentOptions {
    model?: string;
    contents: string;
    systemInstruction?: string;
    responseMimeType?: AiResponseMimeType;
}

interface GenerateAiContentResponse {
    text: string;
}

export async function generateAiContent(options: GenerateAiContentOptions): Promise<string> {
    const response = await api.post<GenerateAiContentResponse>('/ai/generate', options);
    return response.text;
}

export function parseAiJson<T>(text: string): T {
    const trimmed = text.trim();
    const withoutFence = trimmed
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '');

    return JSON.parse(withoutFence) as T;
}

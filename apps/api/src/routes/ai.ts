import { Hono } from 'hono';
import { GoogleGenAI } from '@google/genai';
import { User } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/auth';

type Variables = {
    user: User;
};

type GenerateAiRequest = {
    model?: string;
    contents?: unknown;
    systemInstruction?: unknown;
    responseMimeType?: unknown;
};

const aiRouter = new Hono<{ Variables: Variables }>();

aiRouter.use(authMiddleware);

function getGeminiApiKey() {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY;
}

function getString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() ? value : undefined;
}

aiRouter.post('/generate', async (c) => {
    const body = await c.req.json<GenerateAiRequest>().catch(() => null);
    const contents = getString(body?.contents);

    if (!contents) {
        return c.json({ error: 'contents is required' }, 400);
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        return c.json({ error: 'GEMINI_API_KEY is not configured' }, 503);
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = getString(body?.systemInstruction);
    const responseMimeType = getString(body?.responseMimeType);

    const response = await ai.models.generateContent({
        model: getString(body?.model) || 'gemini-2.5-flash',
        contents,
        config: {
            ...(systemInstruction ? { systemInstruction } : {}),
            ...(responseMimeType ? { responseMimeType } : {}),
        },
    });

    return c.json({ text: response.text || '' });
});

export { aiRouter };


import { GoogleGenAI, Type } from "@google/genai";
import type { IndividualDonor, MessageTemplate, GeneratedMessage, MessageType, SendChannel, Language } from '../types';

export const generatePersonalizedMessage = async (
    donor: IndividualDonor, 
    messageType: MessageType,
    personalizationLevel: 'Low' | 'Medium' | 'High',
    languageSelection: 'auto' | Language,
    templates: MessageTemplate[]
): Promise<Omit<GeneratedMessage, 'message_id' | 'created_at'>> => {

    // 1. Determine Language
    const messageLanguage = languageSelection === 'auto'
        ? (donor.preferred_language || 'en')
        : languageSelection;

    // 2. Select Template
    const template = templates.find(t => 
        t.donor_category === donor.donorCategory && 
        t.message_type === messageType &&
        t.language === messageLanguage
    ) || templates.find(t => t.message_type === messageType && t.language === messageLanguage) // Fallback to same type, same language
      || templates.find(t => t.message_type === messageType && t.language === 'en'); // Final fallback to English template

    if (!template) {
        throw new Error(`No suitable template found for type ${messageType} and language ${messageLanguage}.`);
    }

    // 3. Build Context
    const donorContext = {
        name: donor.fullName[template.language] || donor.fullName.en,
        category: donor.donorCategory,
        totalDonations: donor.totalDonations,
        donationsCount: donor.donationsCount,
        lastDonationDate: donor.lastDonationDate,
        primaryProgram: donor.primaryProgramInterest,
        engagementScore: donor.engagement_score,
        preferredChannel: donor.preferred_contact_channel,
        donorSince: donor.donorSince,
    };
    
    // 4. Construct Gemini Prompt
    const systemInstruction = `You are a professional and empathetic copywriter for a non-profit organization. Your task is to personalize a message template for a specific donor. You will be given a base template (subject and body), details about the donor, and a desired personalization level.

Follow these rules:
1.  **Replace Variables:** Fill in all placeholders like {donor_name} with the provided data.
2.  **Apply Personalization:** Enhance the message based on the requested level (Low, Medium, High).
    *   **Low:** Basic variable replacement.
    *   **Medium:** Add details like donation history summary and loyalty duration.
    *   **High:** Weave in specific details like beneficiary stories, impact metrics, and future suggestions. Make the message feel truly personal and unique.
3.  **Maintain Tone:** Adhere to the template's original tone (e.g., formal, warm, celebratory).
4.  **Language:** Respond in the language of the template (${template.language}).
5.  **Output:** Your final response MUST be a JSON object with 'generated_subject' and 'generated_body' keys.`;

    const userPrompt = `
    **Template:**
    - Subject: "${template.subject_template}"
    - Body: "${template.body_template}"
    
    **Donor Data:**
    \`\`\`json
    ${JSON.stringify(donorContext, null, 2)}
    \`\`\`
    
    **Personalization Level:** ${personalizationLevel}
    
    **Instructions:**
    - Generate a personalized subject and body based on the template and donor data.
    - If a variable is missing from the data, use a generic fallback (e.g., "your recent donation" instead of a specific amount).
    - For high personalization, you can invent a brief, positive beneficiary story or impact metric if not provided. For example: "Your gift helped a young student named Omar receive the books he needed for his final year."
    `;
    
    // 5. Call Gemini API
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    generated_subject: { type: Type.STRING },
                    generated_body: { type: Type.STRING }
                },
                required: ['generated_subject', 'generated_body']
            }
        }
    });
    
    const { generated_subject, generated_body } = JSON.parse(response.text.trim());

    // 6. Calculate scores (simplified)
    let personalization_score = 10;
    if (personalizationLevel === 'Medium') personalization_score = 60;
    if (personalizationLevel === 'High') personalization_score = 90;
    if (generated_body.includes((donor.fullName.en || "").split(' ')[0])) personalization_score = Math.min(100, personalization_score + 5);


    const predicted_open_rate = ((template.success_rate || 50) * 0.4) + ((donor.engagement_score || 50) * 0.3) + (personalization_score * 0.3);

    // 7. Return Generated Message Object
    return {
        donor_id: donor.id,
        template_id: template.template_id,
        message_type: messageType,
        language: template.language,
        generated_subject,
        generated_body,
        personalization_score: Math.min(100, Math.round(personalization_score)),
        predicted_open_rate: Math.min(100, Math.round(predicted_open_rate)),
        scheduled_send_time: new Date().toISOString(),
        status: 'draft',
        send_channel: (donor.preferred_contact_channel === 'call' ? 'email' : donor.preferred_contact_channel) || 'email',
    };
};

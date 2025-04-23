import { createProviderRegistry, customProvider } from "ai";
import { openai } from "./providers";

export const models = {
    openai: {
        nano: {
            name: "Nano",
            id: "gpt-4.1-nano",
            description: "OpenAI's fastest model in the 4.1 series",
            tools: {

            }
        },
        mini: {
            name: "Mini",
            id: "gpt-4.1-mini",
            description: "OpenAI's mid-sized model in the 4.1 series",
            tools: {
                web_search_preview: openai.tools.webSearchPreview({
                    userLocation: {
                        type: 'approximate',
                        city: 'Calgary',
                        country: 'CA',
                        region: 'Alberta',
                        timezone: 'America/Edmonton'
                    }
                })
            }
        },
        normal: {
            name: "Normal",
            id: "gpt-4.1",
            description: "OpenAI's most capable model in the 4.1 series",
            tools: {
                web_search_preview: openai.tools.webSearchPreview({
                    userLocation: {
                        type: 'approximate',
                        city: 'Calgary',
                        country: 'CA',
                        region: 'Alberta',
                        timezone: 'America/Edmonton'
                    }
                })
            }
        }
    }
}

let openaiProvider = customProvider({
    languageModels: Object.entries(models.openai).reduce((acc, [key, model]) => {
        acc[key] = openai.responses(model.id);
        return acc;
    }, {} as Record<string, any>)
});

export const registry = createProviderRegistry({
    openai: openaiProvider
})
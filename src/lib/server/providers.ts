import { OPENAI_API_KEY } from "$env/static/private";
import { createOpenAI } from "@ai-sdk/openai";

export const openai = createOpenAI({
    apiKey: OPENAI_API_KEY
})
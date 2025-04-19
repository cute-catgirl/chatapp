import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ollama-ai-provider';
import { appendResponseMessages, createIdGenerator, generateText, streamText } from 'ai';

import { OPENAI_API_KEY } from '$env/static/private';
import { getChat, saveChat } from '$lib/server/chat-store';
import { redirect } from '@sveltejs/kit';
import { tools } from '$lib/server/tools';

const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
});

const ollama = createOllama();

const user_info = "- My name is Mae.\n- I am transgender (MtF) and go by she/her pronouns.\n- I am 18 years old and in grade 12."

export async function POST({ request, locals }) {
  const { messages, id } = await request.json();

  const result = streamText({
    model: openai.responses("gpt-4o-mini"),
    messages,
    system: "You are a friendly and helpful assistant. Use a friendly, encouraging tone. If asked for realtime data, use your web search tool to access it. The user has provided the following information to tailor your responses: \n" + user_info + "\n Only bring up the user's info when it is related to the topic at hand.",
    maxSteps: 5,
    tools: {
      web_search_preview: openai.tools.webSearchPreview()
    },
    providerOptions: {
      openai: {
        store: true
      }
    },
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16,
    }),
    async onFinish({ response }) {
      // Flatten messages and response messages into a single array
      const allMessages = [...messages, ...response.messages];
      console.log(JSON.stringify(allMessages));
      const existingChat = await getChat(id);
      console.log(existingChat.length);
      // If chat doesn't exist, generate name
      if (existingChat.length == 0) {
        const name = await generateText({
          model: openai.responses("gpt-4.1-nano"),
          system: "You will be provided with a list of messages. Your task is to give a name to the chat based on the messages. The name should be short and descriptive, ideally 1-3 words. Do not respond with anything other than the chosen title.",
          prompt: allMessages.map((message) => {
            return `${message.role}: ${message.content}`;
          }).join('\n'),
        });
        await saveChat(id, locals.user.id, name.text, allMessages);
      } else {
        await saveChat(id, locals.user.id, "Error", allMessages);
      }
    }
  });

  return result.toDataStreamResponse();
}
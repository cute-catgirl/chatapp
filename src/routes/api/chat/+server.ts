import { createOpenAI } from '@ai-sdk/openai';
import { createOllama } from 'ollama-ai-provider';
import { appendResponseMessages, createIdGenerator, generateText, streamText } from 'ai';

import { OPENAI_API_KEY } from '$env/static/private';
import { getChat, saveChat } from '$lib/server/chat-store';
import { redirect } from '@sveltejs/kit';
import { tools } from '$lib/server/tools';
import { registry } from '$lib/server/registry';

const openai = createOpenAI({
	apiKey: OPENAI_API_KEY
});

const ollama = createOllama();

//const user_info = "- My name is Mae.\n- I am transgender (MtF) and go by she/her pronouns.\n- I am 18 years old and in grade 12."

export async function POST({ request, locals }) {
	const { messages, system = null, model = "openai:mini", id } = await request.json();

	let tools = {}

	if (model != "openai:nano") {
		tools['web_search_preview'] = openai.tools.webSearchPreview({
				userLocation: {
					type: 'approximate',
					city: 'Calgary',
					country: 'CA',
					region: 'Alberta',
					timezone: 'America/Edmonton'
				}
			});
	}

	const result = streamText({
		model: registry.languageModel(model),
		messages,
		system,
		maxSteps: 5,
		tools,
		providerOptions: {
			openai: {
				store: true
			}
		},
		experimental_generateMessageId: createIdGenerator({
			prefix: 'msgs',
			size: 16
		}),
		async onError({ error }) {
			console.error('Error:', error);
		},
		async onFinish({ response }) {
			// Flatten messages and response messages into a single array
			const allMessages = [...messages, ...response.messages];
			console.log(JSON.stringify(allMessages));
			const existingChat = await getChat(id);
			console.log(existingChat.length);
			// If chat doesn't exist, generate name
			if (existingChat.length == 0) {
				const name = await generateText({
					model: openai.responses('gpt-4.1-nano'),
					system:
						'You will be provided with a list of messages. Your task is to give a name to the chat based on the messages. The name should be short and descriptive, ideally 1-3 words. Do not respond with anything other than the chosen title.',
					prompt: allMessages
						.map((message) => {
							return `${message.role}: ${message.content}`;
						})
						.join('\n')
				});
				await saveChat(id, locals.user.id, name.text, allMessages);
			} else {
				await saveChat(id, locals.user.id, 'Error', allMessages);
			}
		}
	});

	return result.toDataStreamResponse();
}

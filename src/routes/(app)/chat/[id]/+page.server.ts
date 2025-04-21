import { error } from '@sveltejs/kit';
import { getChatMessages } from '$lib/server/chat-store';
import type { UIMessage } from 'ai';
import { getUserSetting, getUserSystemPrompt } from '$lib/server/settings';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { params } = event;
	if (!event.locals.user) {
		return {
			chats: []
		};
	}
	const messages = await getChatMessages(params.id);
	if (!messages) {
		throw error(404, 'Chat not found');
	}
	const parsedMessages = messages.map((message) => {
		return {
			id: message.id,
			role: message.role,
			parts: JSON.parse(message.content)
		};
	});

	// Load system prompt from user settings
	let systemPrompt = await getUserSystemPrompt(event.locals.user.id);
	return {
		messages: parsedMessages,
		chatId: params.id,
		systemPrompt: systemPrompt ? systemPrompt : ''
	};
};

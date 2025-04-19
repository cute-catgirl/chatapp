import { error } from '@sveltejs/kit';
import { getChatMessages } from '$lib/server/chat-store';
import type { UIMessage } from 'ai';

export async function load({ params }) {
	const messages = await getChatMessages(params.id);
    if (!messages) {
        throw error(404, 'Chat not found');
    }
    const parsedMessages = messages.map((message) => {
        return {
            id: message.id,
            role: message.role,
            parts: JSON.parse(message.content)
        }
    });
    return {
        messages: parsedMessages,
        chatId: params.id
    };
}

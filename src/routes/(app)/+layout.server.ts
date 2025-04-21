import { getChats } from '$lib/server/chat-store';
import { user } from '$lib/server/db/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return {
			chats: []
		};
	}
	console.log(event.locals.user);
	return {
		chats: await getChats(event.locals.user.id),
		user: event.locals.user
	};
};

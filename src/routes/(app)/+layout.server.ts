import { getChats } from '$lib/server/chat-store';
import { user } from '$lib/server/db/schema';
import { getUserSetting } from '$lib/server/settings';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		return {
			chats: []
		};
	}
	let defaultModel = await getUserSetting(event.locals.user.id, 'defaultModel');
	return {
		chats: await getChats(event.locals.user.id),
		user: event.locals.user,
		defaultModel: defaultModel
	}
};

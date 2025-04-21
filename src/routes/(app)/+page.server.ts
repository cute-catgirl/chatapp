import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSetting, getUserSystemPrompt } from '$lib/server/settings';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	// Load system prompt from user settings
	let systemPrompt = await getUserSystemPrompt(event.locals.user.id);
	return { user: event.locals.user, systemPrompt: systemPrompt ? systemPrompt : '' };
};

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	}
};

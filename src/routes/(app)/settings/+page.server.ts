import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserSetting, getUserSystemPrompt, setUserSetting } from '$lib/server/settings';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	let systemPrompt = await getUserSetting(event.locals.user.id, 'systemPrompt');
	let simpleMode = await getUserSetting(event.locals.user.id, 'sp_is_simple');
	let name = await getUserSetting(event.locals.user.id, 'sp_name');
	let pronouns = await getUserSetting(event.locals.user.id, 'sp_pronouns');
	let info = await getUserSetting(event.locals.user.id, 'sp_info');

	return {
		user: event.locals.user,
		systemPrompt: systemPrompt ? systemPrompt : '',
		name: name ? name : '',
		pronouns: pronouns ? pronouns : '',
		info: info ? info : '',
		simpleMode: simpleMode ? simpleMode : 'true'
	};
};

export const actions: Actions = {
	settings: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const formData = await event.request.formData();
		const advancedMode = formData.get('advancedMode')?.toString() || 'false';
		const simpleMode = advancedMode === 'false' ? 'true' : 'false';
		if (simpleMode === 'true') {
			await setUserSetting(event.locals.user.id, 'sp_is_simple', 'true');
			const name = formData.get('name')?.toString() || '';
			const pronouns = formData.get('pronouns')?.toString() || '';
			const info = formData.get('info')?.toString() || '';
			await setUserSetting(event.locals.user.id, 'sp_name', name);
			await setUserSetting(event.locals.user.id, 'sp_pronouns', pronouns);
			if (info.trim().length > 0) {
				await setUserSetting(event.locals.user.id, 'sp_info', info);
			}
			console.log('Simple Mode:', simpleMode);
		} else {
			const systemPrompt = formData.get('systemPrompt')?.toString() || '';
			console.log('System Prompt:', systemPrompt);
			await setUserSetting(event.locals.user.id, 'sp_is_simple', 'false');
			await setUserSetting(event.locals.user.id, 'systemPrompt', systemPrompt);
		}
		return { success: true };
	}
};

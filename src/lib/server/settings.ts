import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { userSettings } from './db/schema';
import { getSimplePrompt } from '$lib';

export async function getUserSetting(userId, key) {
	const setting = await db
		.select()
		.from(userSettings)
		.where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)))
		.limit(1);
	if (setting.length === 0) {
		return null;
	}
	// get value
	const { value } = setting[0];
	return value;
}

export async function setUserSetting(userId, key, value) {
	const existingSetting = await db
		.select()
		.from(userSettings)
		.where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)))
		.limit(1);

	if (existingSetting.length > 0) {
		await db
			.update(userSettings)
			.set({ value })
			.where(and(eq(userSettings.userId, userId), eq(userSettings.key, key)));
	} else {
		await db.insert(userSettings).values({ userId, key, value });
	}
}

export async function getUserSystemPrompt(userId) {
	const isSimple = await getUserSetting(userId, 'sp_is_simple');
	if (isSimple === 'true') {
		const name = await getUserSetting(userId, 'sp_name');
		const pronouns = await getUserSetting(userId, 'sp_pronouns');
		const info = await getUserSetting(userId, 'sp_info');
		if (info && info.trim().length > 0) {
			return getSimplePrompt(name, pronouns, info);
		} else {
			return getSimplePrompt(name, pronouns);
		}
	}
	const customPrompt = await getUserSetting(userId, 'systemPrompt');
	if (customPrompt) {
		return customPrompt;
	}
	return null;
}

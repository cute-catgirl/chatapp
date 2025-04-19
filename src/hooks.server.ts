import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

const handle: Handle = async ({ event, resolve }) => {
	// Handle CORS preflight
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': '*', // Change to specific origin if needed
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			}
		});
	}

	// Auth logic
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		const response = await resolve(event);
		addCORSHeaders(response);
		return response;
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	const response = await resolve(event);
	addCORSHeaders(response);
	return response;
};

// Helper to set CORS headers
function addCORSHeaders(response: Response) {
	response.headers.set('Access-Control-Allow-Origin', '*'); // Change to specific origin if needed
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export { handle };

import { openai } from '@ai-sdk/openai';
import { tool as createTool } from 'ai';
import { z } from 'zod';
import { createResource, findRelevantContent } from './embedding';

export const weatherTool = createTool({
	description: 'Display the weather for a location',
	parameters: z.object({
		location: z.string().describe('The location to get the weather for')
	}),
	execute: async function ({ location }) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return { weather: 'Sunny', temperature: 75, location };
	}
});

export const addResourceTool = createTool({
	description: 'Add a resource to your knowledge base. If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.',
	parameters: z.object({
		content: z
		  .string()
		  .describe('the content or resource to add to the knowledge base'),
	  }),
	  execute: async ({ content }) => createResource({ content })
});

export const retrieveResourceTool = createTool({
	description: 'Get information from your knowledge base to answer questions.',
	parameters: z.object({
		question: z.string().describe('The users question'),
	}),
	execute: async ({ question }) => findRelevantContent(question),
});

export const tools = {
	addResourceTool,
	retrieveResourceTool,
};

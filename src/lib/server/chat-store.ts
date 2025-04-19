import { generateId } from 'ai';
import { db } from './db';
import { chat, message, type Chat, type Message } from './db/schema';
import { desc, eq } from 'drizzle-orm';

export async function createChat(userId: string): Promise<string> {
  const id = generateId(); // generate a unique chat ID
  await db.insert(chat).values({ id, userId, name: "New Chat", createdAt: new Date(), updatedAt: new Date() });
  return id;
}

export async function getChat(id: string) {
    return await db.select().from(chat).where(eq(chat.id, id));
}

export async function getChatMessages(id: string) {
    return await db.select().from(message).where(eq(message.chatId, id));
}

export async function getChats(userId: string) {
    return await db.select().from(chat).where(eq(chat.userId, userId)).orderBy(desc(chat.updatedAt));
}

export async function saveChat(id: string, userId: string, name: string, messages: any[]) {
    console.log("Saving...");
    try {
        // First check if the chat exists
        const existingChat = await db.select().from(chat).where(eq(chat.id, id)).limit(1);
        
        // If the chat doesn't exist, create it first
        if (existingChat.length === 0) {
            await db.insert(chat).values({
                id,
                userId,
                name,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } else {
            // If it exists, update the timestamp
            await db.update(chat).set({ updatedAt: new Date() }).where(eq(chat.id, id));
        }
        
        // Get existing message IDs to avoid duplicates
        const existingMessages = await db.select({ id: message.id })
            .from(message)
            .where(eq(message.chatId, id));
        
        const existingIds = new Set(existingMessages.map(msg => msg.id));
        
        // Transform messages to match your database schema, filtering out existing ones
        const dbMessages: Message[] = messages
            .filter(msg => !msg.id || !existingIds.has(msg.id))
            .map(msg => ({
                id: msg.id || generateId(),
                chatId: id,
                role: msg.role,
                content: JSON.stringify(msg.parts || msg.content),
                createdAt: new Date()
            }));
        
        // Only insert if there are new messages
        if (dbMessages.length > 0) {
            await db.insert(message).values(dbMessages);
        }

        return { "newChat": existingChat.length === 0, "messages": dbMessages, "chatId": id };
    } catch (error) {
        console.error('Error saving chat:', error);
        throw new Error('Failed to save chat');
    }
}
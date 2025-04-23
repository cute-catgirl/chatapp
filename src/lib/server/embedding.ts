import { embed, embedMany } from 'ai';
import { openai } from './providers';
import { db } from './db';
import { embeddings, insertResourceSchema, resources, type NewResourceParams } from './db/schema';
import { embeddings as embeddingsTable } from './db/schema';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

const embeddingModel = openai.embedding('text-embedding-3-small');

const generateChunks = (input: string): string[] => {
	return input
		.trim()
		.split('.')
		.filter((i) => i !== '');
};

export const generateEmbeddings = async (
	value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
	const chunks = generateChunks(value);
	const { embeddings } = await embedMany({
		model: embeddingModel,
		values: chunks
	});
	return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
      model: embeddingModel,
      value: input,
    });
    return embedding;
  };
  
  export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded,
    )})`;
    const similarGuides = await db
      .select({ name: embeddings.content, similarity })
      .from(embeddings)
      .where(gt(similarity, 0.4))
      .orderBy(t => desc(t.similarity))
      .limit(4);
    return similarGuides;
  };

export const createResource = async (input: NewResourceParams) => {
    try {
      const { content } = insertResourceSchema.parse(input);
  
      const [resource] = await db
        .insert(resources as any)
        .values({ content })
        .returning();
  
      const embeddings = await generateEmbeddings(content as any);
      await db.insert(embeddingsTable as any).values(
        embeddings.map(embedding => ({
          resourceId: resource.id,
          ...embedding,
        })),
      );
  
      return 'Resource successfully created and embedded.';
    } catch (error) {
      return error instanceof Error && error.message.length > 0
        ? error.message
        : 'Error, please try again.';
    }
  };
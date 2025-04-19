// place files you want to import through the `$lib` alias in this folder.
import { createIdGenerator } from 'ai';

// Create a standardized ID generator for messages
export const messageIdGenerator = createIdGenerator({
  prefix: 'msg',  // Single consistent prefix
  size: 16,
});
import { z } from 'zod';

const createTeamSchema = z.object({
  name: z.string().min(1).max(50).trim()
});

export { createTeamSchema };

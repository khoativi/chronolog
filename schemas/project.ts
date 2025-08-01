import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  teamId: z.uuid()
});

const updateProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100).trim(),
  teamId: z.uuid()
});

const deleteProjectSchema = z.object({
  id: z.uuid(),
  teamId: z.uuid()
});

const createEventProjectSchema = z.object({
  projectId: z.uuid(),
  title: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(10000).trim(),
  eventDate: z.iso.datetime()
});

export {
  createEventProjectSchema,
  createProjectSchema,
  deleteProjectSchema,
  updateProjectSchema
};

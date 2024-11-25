import z from 'zod';

export const profileSchema = z.object({
    gender: z.string(),
    sexualPreferences: z.string(),
    bio: z.string(),
    location: z.string(),
    pictures: z.array(z.string()),
    interests: z.string(),
});
import { z } from 'zod';

export const GamePlayersSchema = z
  .object({
    min: z.number().int().min(1),
    max: z.number().int(),
    softLimit: z.boolean().nullable(),
  })
  .refine((p) => p.max >= p.min, {
    message: 'players.max must be >= players.min',
    path: ['max'],
  });

export const GameSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().nullable(),
    url: z.string().url(),
    players: GamePlayersSchema,
    price: z.number().min(0),
    duration: z.array(z.enum(['short', 'medium', 'long'])).min(1),
    platforms: z.array(z.enum(['web', 'windows', 'linux', 'macos'])).min(1),
    multiplayerType: z.array(z.enum(['local', 'remote'])).min(1),
    tags: z.array(z.string()),
    controls: z.array(z.enum(['smartphone-controller', 'game-controller'])),
    image: z.string().nullable(),
  })
  .strict();

export const GameFiltersSchema = z.object({
  query: z.string(),
  duration: z.array(z.enum(['short', 'medium', 'long'])),
  platforms: z.array(z.enum(['web', 'windows', 'linux', 'macos'])),
  price: z.array(z.enum(['free', 'cheap', 'medium', 'expensive'])),
  multiplayerType: z.array(z.enum(['local', 'remote'])),
  playerCount: z.number().int().min(1).nullable(),
  controls: z.array(z.enum(['smartphone-controller', 'game-controller'])),
});

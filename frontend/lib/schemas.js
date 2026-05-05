import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const loginSchema = registerSchema;

export const saveProjectSchema = z.object({
  lyricsProjectId: z.string().min(1),
  status: z.string().min(1),
  outputPath: z.string().nullable().optional(),
  lastError: z.string().nullable().optional(),
});

export const uploadProjectSchema = z.object({
  lyrics: z.string().trim().min(1, "Lyrics are required."),
  hasAudio: z.boolean().refine((v) => v, "Audio is required."),
});

export const createTrackSchema = z.object({
  title: z.string().trim().min(1, "Track title is required."),
  artist: z.string().trim().min(1, "Artist is required."),
  durationSec: z.number().int().positive().default(234),
  fileSizeMb: z.number().int().positive().default(59),
  fileType: z.string().trim().min(1).default(".wav"),
});

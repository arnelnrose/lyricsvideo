import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createTrackSchema } from "@/lib/schemas";
import { getSessionUser, unauthorizedResponse } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const tracks = await prisma.track.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tracks });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = createTrackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request body." },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const track = await prisma.track.create({
      data: {
        ownerId: user.id,
        title: payload.title,
        artist: payload.artist,
        durationSec: payload.durationSec,
        fileSizeMb: payload.fileSizeMb,
        fileType: payload.fileType,
      },
    });

    return NextResponse.json({ track }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

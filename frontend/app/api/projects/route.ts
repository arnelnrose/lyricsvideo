import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { saveProjectSchema } from "@/lib/schemas";
import { getSessionUser, unauthorizedResponse } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = saveProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request body." },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const project = await prisma.project.upsert({
      where: { lyricsProjectId: payload.lyricsProjectId },
      update: {
        status: payload.status,
        outputPath: payload.outputPath ?? null,
        lastError: payload.lastError ?? null,
      },
      create: {
        ownerId: user.id,
        lyricsProjectId: payload.lyricsProjectId,
        status: payload.status,
        outputPath: payload.outputPath ?? null,
        lastError: payload.lastError ?? null,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

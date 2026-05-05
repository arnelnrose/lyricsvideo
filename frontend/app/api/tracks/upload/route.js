import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorizedResponse } from "@/lib/session";

function getTitleFromFilename(name) {
  if (!name) return "Untitled Track";
  return name.replace(/\.[^/.]+$/, "").trim() || "Untitled Track";
}

function getExt(name) {
  const m = name?.match(/(\.[^./\\]+)$/);
  return m ? m[1].toLowerCase() : "";
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const form = await request.formData();
    const files = form.getAll("files");
    const fileEntries = files.filter((f) => typeof f === "object" && "name" in f);

    if (fileEntries.length === 0) {
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }

    const data = fileEntries.map((file) => {
      const sizeMb = Math.max(1, Math.round((file.size || 0) / (1024 * 1024)));
      return {
        ownerId: user.id,
        title: getTitleFromFilename(file.name),
        artist: "Unknown Artist",
        durationSec: 0,
        fileSizeMb: sizeMb,
        fileType: getExt(file.name) || ".audio",
        originalFileName: file.name || null,
        mimeType: file.type || null,
      };
    });

    await prisma.track.createMany({ data });
    return NextResponse.json({ createdCount: data.length }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

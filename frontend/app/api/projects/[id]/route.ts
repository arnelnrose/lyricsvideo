import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser, unauthorizedResponse } from "@/lib/session";

export async function PATCH(request, { params }) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json();
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { id: true, ownerId: true },
    });

    if (!project || project.ownerId !== user.id) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        status: typeof body.status === "string" ? body.status : undefined,
        outputPath:
          typeof body.outputPath === "string"
            ? body.outputPath
            : body.outputPath === null
              ? null
              : undefined,
        lastError:
          typeof body.lastError === "string"
            ? body.lastError
            : body.lastError === null
              ? null
              : undefined,
      },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

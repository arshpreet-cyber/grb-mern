import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
    }

    await prisma.attachment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media." }, { status: 500 });
  }
}

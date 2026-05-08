import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditorWrapper from "@/components/editor/EditorWrapper";

export const dynamic = 'force-dynamic';

export default async function AdminEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let page;
  try {
    page = await prisma.page.findUnique({ where: { id } }) as any;
  } catch {
    notFound();
  }

  if (!page) notFound();

  return <EditorWrapper initialPage={page} />;
}

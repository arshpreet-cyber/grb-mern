import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { sections, title, publish, id } = body;
    
    const updateData: any = {
      title: title || 'Untitled',
      draftSections: Array.isArray(sections) ? sections : [],
      updatedAt: new Date()
    };

    if (publish) {
      console.log(`[API] PUBLISHING LIVE: ${slug}`);
      updateData.sections = Array.isArray(sections) ? sections : [];
      updateData.status = 'Published';
    } else {
      console.log(`[API] SAVING DRAFT: ${slug}`);
    }

    const updatedPage = await prisma.page.update({
      where: { id: id || undefined, slug: !id ? slug : undefined },
      data: JSON.parse(JSON.stringify(updateData, (k, v) => typeof v === 'bigint' ? v.toString() : v))
    });

    // Only revalidate the public path if we are publishing live
    if (publish) {
      revalidatePath(`/${slug === 'home' ? '' : slug}`);
      revalidatePath(`/(website)/[slug]`, 'page');
    }

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

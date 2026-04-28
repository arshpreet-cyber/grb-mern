import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ identifier: string }> | { identifier: string } }) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.identifier;
    
    const isId = !isNaN(Number(identifier));
    
    const blog = await prisma.blog.findFirst({
      where: {
        OR: [
          isId ? { id: BigInt(identifier) } : { slug: identifier },
          { slug: identifier }
        ],
        deleted_at: null
      }
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      blog: { 
        ...blog, 
        id: blog.id.toString(),
        created_at: blog.created_at.toISOString(),
        updated_at: blog.updated_at.toISOString(),
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blog", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ identifier: string }> | { identifier: string } }) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.identifier;
    const isId = !isNaN(Number(identifier));
    const data = await req.json();

    const updateData: any = {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      category_id: data.category_id,
      subcategory_id: data.subcategory_id,
      tag: data.tag,
      keywords: data.keywords,
      meta_description: data.meta_description,
      meta_title: data.meta_title,
      canonical_link: data.canonical_link,
      media: data.media,
      author: data.author,
      about_author: data.about_author,
    };
    
    if (data.status !== undefined) {
      updateData.status = Number(data.status);
    }

    const blog = await prisma.blog.updateMany({
      where: {
        AND: [
          isId ? { id: BigInt(identifier) } : { slug: identifier },
          { deleted_at: null }
        ]
      },
      data: updateData,
    });

    if (blog.count === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ identifier: string }> | { identifier: string } }) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.identifier;
    const isId = !isNaN(Number(identifier));

    const blog = await prisma.blog.updateMany({
      where: isId ? { id: BigInt(identifier) } : { slug: identifier },
      data: { deleted_at: new Date() }
    });

    if (blog.count === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete blog", details: error.message }, { status: 500 });
  }
}

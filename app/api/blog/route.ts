import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: "Missing required fields: title, slug, or content" }, { status: 400 });
    }

    const newBlog = await prisma.blog.create({
      data: {
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
        status: Number(data.status) || 2,
        user_id: data.user_id,
      },
    });

    return NextResponse.json({ success: true, blog: { ...newBlog, id: newBlog.id.toString() } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create blog", details: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let where: any = { deleted_at: null };

    if (statusParam && statusParam !== 'all') {
      where.status = parseInt(statusParam);
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.blog.count({ where });

    const formattedBlogs = blogs.map(b => ({
      ...b,
      id: b.id.toString(),
      created_at: b.created_at.toISOString(),
      updated_at: b.updated_at.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      blogs: formattedBlogs,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blogs", details: error.message }, { status: 500 });
  }
}

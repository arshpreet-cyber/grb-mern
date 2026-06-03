import "dotenv/config";
import prisma from "../lib/prisma";
import fs from "fs";
import path from "path";

const mediaDir = path.join(process.cwd(), "public", "uploads", "media");

async function main() {
  if (!fs.existsSync(mediaDir)) {
    console.error("Media directory does not exist:", mediaDir);
    return;
  }

  const files = fs.readdirSync(mediaDir);
  console.log(`Found ${files.length} files in media directory.`);

  for (const file of files) {
    const filePath = path.join(mediaDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) continue;

    const mediaUrl = `/uploads/media/${file}`;

    // Check if it already exists in the database
    const existing = await prisma.attachment.findFirst({
      where: { mediaUrl },
    });

    if (existing) {
      console.log(`Already exists: ${file}`);
      continue;
    }

    // Determine type and mime-type
    let mimeType = "image/png";
    if (file.endsWith(".jpg") || file.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (file.endsWith(".webp")) mimeType = "image/webp";
    else if (file.endsWith(".svg")) mimeType = "image/svg+xml";
    else if (file.endsWith(".avif")) mimeType = "image/avif";
    else if (file.endsWith(".gif")) mimeType = "image/gif";
    
    // Determine category based on file name or default to PAGE
    let category = "PAGE";
    const lowerFile = file.toLowerCase();
    if (lowerFile.includes("logo")) category = "LOGO";
    else if (lowerFile.includes("blog")) category = "BLOG";
    else if (lowerFile.includes("banner")) category = "BANNER";

    // Clean name for Alt text
    const cleanAlt = file
      .replace(/^\d+-([a-f0-9-]+-)?/, "") // remove timestamp and uuid prefix
      .replace(/\.[^/.]+$/, "")            // remove extension
      .replace(/[-_]+/g, " ");             // replace hyphens and underscores with spaces

    await prisma.attachment.create({
      data: {
        mediaUrl,
        alt: cleanAlt || "Uploaded Asset",
        mediaType: mimeType,
        type: category as any,
        isTitle: "true",
      },
    });

    console.log(`Added: ${file} as ${category}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

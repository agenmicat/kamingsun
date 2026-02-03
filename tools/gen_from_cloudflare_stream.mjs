import fs from "fs";
import path from "path";

// Pastikan variabel lingkungan tersedia
const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN  = process.env.CF_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Error: Missing CF_ACCOUNT_ID or CF_API_TOKEN env var.");
  process.exit(1);
}

const POSTS_DIR = "posts";

// Pastikan folder posts ada
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// Fungsi untuk membuat slug yang rapi untuk URL/Nama File
function slugify(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "video";
}

// Aman untuk YAML string (menghindari error jika judul ada tanda kutip)
function yamlEscape(s) {
  const t = (s ?? "").toString().replace(/"/g, '\\"');
  return `"${t}"`;
}

// Format thumbnail Cloudflare Stream
function thumbUrl(uid) {
  return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s`;
}

// Helper untuk fetch ke API Cloudflare
async function cfFetch(url) {
  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

// Ambil daftar video
async function listVideos() {
  const url = `https://api.api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`;
  const data = await cfFetch(url);
  return data.result || [];
}

// Fungsi untuk men-generate isi konten Markdown
function mdForVideo(v) {
  const uid = v.uid;
  const title = v?.meta?.name || `Video ${uid}`;
  const created = v.created || "";
  const duration = v.duration ?? "";
  const slug = slugify(title);

  const category = "video";
  const tags = ["cloudflare-stream"];

  return `---
title: ${yamlEscape(title)}
description: ${yamlEscape("")}
layout: video.njk
permalink: "/posts/${slug}/"
category: ${yamlEscape(category)}
tags: [${tags.map(yamlEscape).join(", ")}]
video:
  provider: "cloudflare"
  id: ${yamlEscape(uid)}
thumbnail: ${yamlEscape(thumbUrl(uid))}
created: ${yamlEscape(created)}
duration: ${yamlEscape(duration)}
---

Tulis deskripsi lengkap di sini (optional).
`;
}

// Fungsi Utama
(async () => {
  try {
    const videos = await listVideos();
    console.log(`Found ${videos.length} videos`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const v of videos) {
      const uid = v.uid;
      const title = v?.meta?.name || `Video ${uid}`;
      
      // Buat slug untuk nama file
      const slug = slugify(title);
      
      // Gunakan kombinasi slug dan UID agar file selalu unik (mencegah overwrite jika judul sama)
      const fileName = `${slug}-${uid}.md`;
      const filePath = path.join(POSTS_DIR, fileName);

      // Cek jika file sudah ada
      if (fs.existsSync(filePath)) {
        skippedCount++;
        continue; 
      }

      // GENERATE KONTEN (Memperbaiki error 'md is not defined')
      const mdContent = mdForVideo(v);

      // TULIS FILE
      fs.writeFileSync(filePath, mdContent, "utf8");
      createdCount++;
    }

    console.log("---");
    console.log(`Success: ${createdCount} new posts created.`);
    console.log(`Skipped: ${skippedCount} existing posts.`);
  } catch (err) {
    console.error("Execution failed:", err.message);
  }
})();
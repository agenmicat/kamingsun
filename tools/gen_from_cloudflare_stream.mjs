import fs from "fs";
import path from "path";

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN  = process.env.CF_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Missing CF_ACCOUNT_ID or CF_API_TOKEN env var.");
  process.exit(1);
}

const POSTS_DIR = "posts";
fs.mkdirSync(POSTS_DIR, { recursive: true });

// slug sederhana
function slugify(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "video";
}

// aman untuk YAML string
function yamlEscape(s) {
  const t = (s ?? "").toString().replace(/"/g, '\\"');
  return `"${t}"`;
}

// NOTE: thumbnail URL
// Docs Cloudflare menunjukkan format thumbnail berbasis domain customer-*.cloudflarestream.com
// Kalau kamu belum punya domain customer, pakai videodelivery.net sering dipakai untuk thumbnail.
// Kamu bisa ubah sesuai setup kamu.
function thumbUrl(uid) {
  return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s`;
}

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

// List videos (up to 1000)
async function listVideos() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`;
  const data = await cfFetch(url);
  // Cloudflare API returns { success, result, ... }
  return data.result || [];
}

function mdForVideo(v) {
  const uid = v.uid;
  const title = v?.meta?.name || `Video ${uid}`;
  const created = v.created || "";
  const duration = v.duration ?? "";

  // default kategori/tag bisa kamu ubah
  const category = "video";
  const tags = ["cloudflare-stream"];

  const fm =
`---
title: ${yamlEscape(title)}
description: ${yamlEscape("")}
layout: video.njk
permalink: "/posts/${slugify(title)}/"
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

  return fm;
}

(async () => {
  const videos = await listVideos();
  console.log(`Found ${videos.length} videos`);

  let createdCount = 0;
  for (const v of videos) {
    const uid = v.uid;
    const title = v?.meta?.name || `Video ${uid}`;
    const slug = uid;

    // filename pakai uid biar unik (menghindari judul sama)
    const file = path.join(POSTS_DIR, `${slug}__${uid}.md`);

    if (fs.existsSync(file)) continue; // sudah ada, skip (aman)
    fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), md, "utf8");
    createdCount++;
  }

  console.log(`Created ${createdCount} new post files.`);
})();

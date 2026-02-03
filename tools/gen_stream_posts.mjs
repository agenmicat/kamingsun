import fs from "fs";
import path from "path";

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const API_TOKEN = process.env.CF_API_TOKEN;

const SITE_NAME = process.env.SITE_NAME || "AgenMicat";

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error("Missing CF_ACCOUNT_ID or CF_API_TOKEN env var.");
  process.exit(1);
}

const POSTS_DIR = "posts";
fs.mkdirSync(POSTS_DIR, { recursive: true });

function cleanTitle(raw) {
  let t = (raw || "").toString().trim();
  // remove common video extensions
  t = t.replace(/\.(mp4|mov|mkv|webm|avi|m4v)$/i, "");
  // replace underscores with spaces
  t = t.replace(/[_]+/g, " ");
  // collapse spaces
  t = t.replace(/\s+/g, " ").trim();
  return t || "Untitled Video";
}

// YAML safe string
function yamlEscape(s) {
  const t = (s ?? "").toString().replace(/"/g, '\\"');
  return `"${t}"`;
}

// Cloudflare Stream thumbnail (as you use)
function thumbUrl(uid) {
  return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`;
}

function defaultDescription(title) {
  return `Anda sedang menonton video ${title} di website ${SITE_NAME}.`;
}

async function cfFetch(url) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
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
  return data.result || [];
}

function mdForVideo(v) {
  const uid = v.uid;
  const rawTitle = v?.meta?.name || `Video ${uid}`;
  const title = cleanTitle(rawTitle);

  const category = "Video";
  const tags = ["Cloudflare", "Stream"]; // kamu bisa ubah

  return `---
title: ${yamlEscape(title)}
description: ${yamlEscape(defaultDescription(title))}
layout: video.njk
permalink: "/posts/${uid}/"
category: ${yamlEscape(category)}
tags: [${tags.map(yamlEscape).join(", ")}]
video:
  provider: "cloudflare"
  id: ${yamlEscape(uid)}
thumbnail: ${yamlEscape(thumbUrl(uid))}
---

Tulis catatan tambahan di sini (optional).
`;
}

(async () => {
  const videos = await listVideos();
  console.log(`Found ${videos.length} videos`);

  let createdCount = 0;

  for (const v of videos) {
    const uid = v?.uid;
    if (!uid) continue;

    // slug = uid (anti bentrok, anti guessing)
    const file = path.join(POSTS_DIR, `${uid}.md`);

    if (fs.existsSync(file)) continue;

    const md = mdForVideo(v);
    fs.writeFileSync(file, md, "utf8");

    createdCount++;
  }

  console.log(`Created ${createdCount} new post files.`);
})();

---
title: Search
layout: base.njk
permalink: "/search/"
---

# Search

<input id="q" class="search-box" type="search" placeholder="Cari judul, tag, kategori..." autocomplete="off" />

<div id="hint" class="search-hint">Ketik minimal 2 huruf.</div>

<div id="results" class="search-results"></div>

<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2"></script>
<script src="/assets/search.js"></script>

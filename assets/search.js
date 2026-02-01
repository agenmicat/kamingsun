(async function () {
  const q = document.getElementById("q");
  const resultsEl = document.getElementById("results");
  const hintEl = document.getElementById("hint");

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return (params.get(name) || "").trim();
  }

  function render(found) {
    if (!found.length) {
      resultsEl.innerHTML = `<div class="search-empty">Tidak ada hasil.</div>`;
      return;
    }

    resultsEl.innerHTML = found.map(({ item }) => {
      const tags = (item.tags || []).slice(0, 6).map(t => `<span class="pill">#${escapeHtml(t)}</span>`).join("");
      const cat = item.category ? `<span class="pill pill-cat">${escapeHtml(item.category)}</span>` : "";
      const desc = item.description ? `<div class="result-desc">${escapeHtml(item.description)}</div>` : "";

      return `
        <a class="result-card" href="${item.url}">
          <div class="result-title">${escapeHtml(item.title)}</div>
          <div class="result-meta">${cat}${tags}</div>
          ${desc}
        </a>
      `;
    }).join("");
  }

  // Load index
  let data = [];
  try {
    const res = await fetch("/search.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    hintEl.textContent = "Gagal memuat search index (/search.json).";
    return;
  }

  // Pastikan Fuse tersedia
  if (typeof Fuse === "undefined") {
    hintEl.textContent = "Fuse.js belum termuat. Cek script CDN di halaman /search/.";
    return;
  }

  const fuse = new Fuse(data, {
    includeScore: true,
    threshold: 0.35,
    keys: [
      { name: "title", weight: 0.6 },
      { name: "tags", weight: 0.3 },
      { name: "category", weight: 0.2 },
      { name: "description", weight: 0.2 }
    ]
  });

  function doSearch(term) {
    const t = (term || "").trim();
    if (t.length < 2) {
      hintEl.textContent = "Ketik minimal 2 huruf.";
      resultsEl.innerHTML = "";
      return;
    }
    hintEl.textContent = "";
    const found = fuse.search(t).slice(0, 20);
    render(found);
  }

  // Input handler (live)
  q.addEventListener("input", () => doSearch(q.value));

  // ✅ Auto-search from URL: /search/?q=drama
  const initial = getQueryParam("q");
  if (initial) {
    q.value = initial;
    doSearch(initial);
  } else {
    hintEl.textContent = "Ketik minimal 2 huruf.";
  }
})();

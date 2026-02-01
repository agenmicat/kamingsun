(async function () {
  const q = document.getElementById("q");
  const resultsEl = document.getElementById("results");
  const hintEl = document.getElementById("hint");

  let data = [];
  try {
    const res = await fetch("/search.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    hintEl.textContent = "Gagal memuat search index (/search.json).";
    return;
  }

  const fuse = new Fuse(data, {
    includeScore: true,
    threshold: 0.35, // makin kecil makin ketat
    keys: [
      { name: "title", weight: 0.6 },
      { name: "tags", weight: 0.3 },
      { name: "category", weight: 0.2 },
      { name: "description", weight: 0.2 }
    ]
  });

  function render(items) {
    if (!items.length) {
      resultsEl.innerHTML = `<div class="search-empty">Tidak ada hasil.</div>`;
      return;
    }
    
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
    }
    const initial = getQueryParam("q");
    if (initial) {
      q.value = initial;
      setTimeout(() => {
    const found = fuse.search(initial).slice(0, 20);
      render(found);
        hintEl.textContent = "";
        }, 0);
    }

    resultsEl.innerHTML = items.map(({ item }) => {
      const tags = (item.tags || []).slice(0, 6).map(t => `<span class="pill">#${t}</span>`).join("");
      const cat = item.category ? `<span class="pill pill-cat">${item.category}</span>` : "";
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

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[m]));
  }

  function onInput() {
    const term = (q.value || "").trim();
    if (term.length < 2) {
      hintEl.textContent = "Ketik minimal 2 huruf.";
      resultsEl.innerHTML = "";
      return;
    }
    hintEl.textContent = "";
    const found = fuse.search(term).slice(0, 20); // max hasil
    render(found);
  }

  q.addEventListener("input", onInput);
})();

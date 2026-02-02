---
title: Blog Video
layout: base.njk
---

<form action="/search/" method="get" class="home-search">
  <input
    type="search"
    name="q"
    placeholder="Cari video, tag, kategori…"
    aria-label="Cari"
  />
</form>

# Daftar Video 🎬

<ul class="video-grid">
{% for post in collections.posts %}
  {% set thumb = post.data.thumbnail or "" %}

  {# fallback thumbnail by provider #}
  {% if (not thumb) and post.data.video and post.data.video.provider == "youtube" and post.data.video.id %}
    {% set thumb = "https://i.ytimg.com/vi/" + post.data.video.id + "/hqdefault.jpg" %}
  {% endif %}

  {% if (not thumb) and post.data.video and post.data.video.provider == "cloudflare" and post.data.video.id %}
    {% set thumb = "https://videodelivery.net/" + post.data.video.id + "/thumbnails/thumbnail.jpg" %}
  {% endif %}

  <li class="video-card">
    <a class="thumb" href="{{ post.url }}">
      {% if thumb %}
        <img src="{{ thumb }}" alt="{{ post.data.title }}">
      {% endif %}

      {% if post.data.category %}
        <span class="badge">{{ post.data.category }}</span>
      {% endif %}
    </a>

    <div class="video-info">
      <h2 class="video-title"><a href="{{ post.url }}">{{ post.data.title }}</a></h2>

      {% if post.data.tags and (post.data.tags | length) > 0 %}
        <div class="video-tags">
          {% for t in post.data.tags | slice(0, 3) %}
            <span class="tag">#{{ t }}</span>
          {% endfor %}
        </div>
      {% endif %}
    </div>
  </li>
{% endfor %}
</ul>

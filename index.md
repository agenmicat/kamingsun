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
  <li class="video-card">
    <a class="thumb" href="{{ post.url }}">
      {% set yid = "" %}
{# format baru #}
{% if post.data.video and post.data.video.provider == "youtube" and post.data.video.id %}
  {% set yid = post.data.video.id %}
{# format lama #}
{% elif post.data.youtube_id %}
  {% set yid = post.data.youtube_id %}
{% endif %}
{% if yid %}
  <img src="https://i.ytimg.com/vi/{{ yid }}/hqdefault.jpg" alt="{{ post.data.title }}">
{% elif post.data.thumbnail %}
  <img src="{{ post.data.thumbnail }}" alt="{{ post.data.title }}">
{% endif %}
      {% if post.data.category %}
        <span class="badge">{{ post.data.category }}</span>
      {% endif %}
    </a>
    <div class="video-info">
      <h2 class="video-title"><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    </div>
  </li>
{% endfor %}
</ul>


---
title: Blog Video
layout: base.njk
---

# Daftar Video 🎬

<ul class="video-grid">
{% for post in collections.posts %}
  <li class="video-card">
    <a class="thumb" href="{{ post.url }}">
      {% if post.data.youtube_id %}
        <img src="https://i.ytimg.com/vi/{{ post.data.youtube_id }}/hqdefault.jpg" alt="{{ post.data.title }}">
      {% endif %}
    </a>
    <div class="video-info">
      <h2 class="video-title">
        <a href="{{ post.url }}">{{ post.data.title }}</a>
      </h2>
      {% if post.data.date %}
        <div class="video-meta">{{ post.data.date | date: "%d %b %Y" }}</div>
      {% endif %}
    </div>
  </li>
{% endfor %}
</ul>

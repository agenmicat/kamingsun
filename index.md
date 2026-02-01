---
title: Blog Video Saya
layout: base.njk
---

# Daftar Video 🎬

<ul class="post-list">
{% for post in collections.posts %}
  <li class="post-card">
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    {% if post.data.date %}
      <div class="post-meta">{{ post.data.date | date: "%d %b %Y" }}</div>
    {% endif %}
  </li>
{% endfor %}
</ul>

---
title: Blog Video
layout: base.njk
---

# Daftar Video 🎬

<ul class="post-list">
{% for post in collections.posts %}
  <li class="post-card">
    {% if post.data.youtube_id %}
      <a href="{{ post.url }}">
        <img src="https://i.ytimg.com/vi/{{ post.data.youtube_id }}/hqdefault.jpg" alt="{{ post.data.title }}">
      </a>
    {% endif %}
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
  </li>
{% endfor %}
</ul>

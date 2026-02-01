---
title: Tags
layout: base.njk
permalink: "/tags/"
---

# Semua Tag

<ul class="tag-list">
{% for tag in collections.tagList %}
  <li><a href="/tags/{{ tag | url }}/">#{{ tag }}</a></li>
{% endfor %}
</ul>

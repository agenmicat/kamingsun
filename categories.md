---
title: Categories
layout: base.njk
permalink: "/categories/"
---

# Categories

<div class="cat-row">
{% for c in collections.categoryList %}
  <a class="cat-pill" href="/categories/{{ c | url }}/">{{ c }}</a>
{% endfor %}
</div>

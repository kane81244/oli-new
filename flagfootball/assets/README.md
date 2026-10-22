# assets

Files the profile links to. Drop the real files in here with these exact
names, or edit the matching path in `../js/data.js`.

| File | Linked from | Used for |
| --- | --- | --- |
| `olivia-hero.jpg` | Hero — media frame (`hero.poster`) | Action photo, portrait crop, 1600px+ on the long edge. **Currently a stock placeholder** (Pexels #37107407, free license) — replace with Olivia's own game photo, then restore her name in `hero.posterAlt` and the ESPN caption in `js/data.js`. |
| `Olivia_Resume.pdf` | Academics — "Official resume (PDF)" and the hero "Download resume" button | Testing, honours, film and contact sheet |

Until a file exists, its link returns 404 from the web server. Remove the entry
from `data.js` to drop the link instead (the layout closes up on its own).
`Olivia_Resume.pdf` is still missing, so those links 404 until it is dropped in.

## Hero media

The frame shows `hero.video` when set (a muted loop, skipped for reduced motion
and data saver), then `hero.poster`, then a warm monogram placeholder. A file
that is missing or fails to load falls through the chain — the page never shows
a broken image icon.

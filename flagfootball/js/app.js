/* ==========================================================================
   Flag football recruiting profile — application script
   Reads athleteData (js/data.js) and renders every section.
   Never edited per athlete: all client-specific text lives in data.js.

   Vanilla JS, no dependencies. Sections render top to bottom via init()
   and each one quietly removes itself when its data is missing.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof athleteData === 'undefined' || !athleteData) {
    console.error('Flag football profile: js/data.js did not define athleteData.');
    return;
  }

  var D = athleteData;
  var lastTrigger = null;

  var PLAY_SVG = '<svg width="14" height="16" viewBox="0 0 18 20" aria-hidden="true" focusable="false">' +
    '<path d="M3 2 16 10 3 18Z" fill="currentColor"></path></svg>';

  var CHECK_SVG = '<svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true" focusable="false">' +
    '<path d="M1.5 6.4 4.4 9.3 10.5 3" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  var ARROW_SVG = '<svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true" focusable="false">' +
    '<path d="M4 14 14 4M7 4h7v7" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  /* ---------- helpers ---------- */

  function $(id) {
    return document.getElementById(id);
  }

  function has(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim() !== '';
  }

  /* Every value that reaches innerHTML goes through this first. */
  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(
      /[&<>"']/g,
      function (character) {
        switch (character) {
          case '&': return '&amp;';
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          default: return '&#39;';
        }
      }
    );
  }

  function listFrom(value) {
    return Array.isArray(value) ? value : [];
  }

  function youtubeId(raw) {
    return String(raw || '').replace(/[^A-Za-z0-9_-]/g, '');
  }

  function telHref(phone) {
    return String(phone || '').replace(/[^\d+]/g, '');
  }

  function pad(number) {
    return (number < 10 ? '0' : '') + number;
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return list[i];
    }
    return null;
  }

  function initialsOf(name) {
    var letters = String(name || '').trim().split(/\s+/).map(function (word) {
      return word.charAt(0);
    }).join('').slice(0, 2).toUpperCase();
    return letters || 'OB';
  }

  /* ---------- dates ---------- */

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* "2027-06-15" -> { y, m, d }. Parsed as plain numbers so no timezone can
     shift the calendar day the way new Date("2027-06-15") can. */
  function partsFromIsoDate(value) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || '').trim());
    if (!match) return null;
    return { y: +match[1], m: +match[2], d: +match[3] };
  }

  function weekdayOf(parts) {
    return WEEKDAYS[new Date(Date.UTC(parts.y, parts.m - 1, parts.d)).getUTCDay()];
  }

  function formatDate(value) {
    var parts = partsFromIsoDate(value);
    if (!parts) return has(value) ? String(value) : '';
    return weekdayOf(parts) + ', ' + MONTHS[parts.m - 1] + ' ' + parts.d + ', ' + parts.y;
  }

  /* Single day -> "Sat, Nov 14, 2026". Multi day -> "Jun 15 - 18, 2027". */
  function formatRange(start, end) {
    var from = partsFromIsoDate(start);
    var to = partsFromIsoDate(end);
    if (!from) return formatDate(start);
    if (!to || (from.y === to.y && from.m === to.m && from.d === to.d)) return formatDate(start);

    var lead = MONTHS[from.m - 1] + ' ' + from.d;
    if (from.y !== to.y) return formatDate(start) + ' - ' + formatDate(end);
    if (from.m !== to.m) return lead + ' - ' + MONTHS[to.m - 1] + ' ' + to.d + ', ' + to.y;
    return lead + ' - ' + to.d + ', ' + to.y;
  }

  function dayCount(start, end) {
    var from = partsFromIsoDate(start);
    var to = partsFromIsoDate(end) || from;
    if (!from) return 1;
    var a = Date.UTC(from.y, from.m - 1, from.d);
    var b = Date.UTC(to.y, to.m - 1, to.d);
    return Math.round((b - a) / 86400000) + 1;
  }

  /* ---------- document chrome ---------- */

  function applyTheme() {
    var accent = D.site && D.site.accent;
    if (has(accent)) {
      document.documentElement.style.setProperty('--accent', String(accent).trim());
    }
  }

  function applyTitle() {
    var profile = D.profile || {};
    var name = has(profile.name) ? String(profile.name).trim() : 'Athlete';
    var sport = has(profile.sport) ? String(profile.sport).trim() : 'Recruiting';
    var year = has(profile.classYear) ? ', class of ' + String(profile.classYear).trim() : '';
    document.title = name + ' — ' + sport + ' recruiting profile' + year;

    var description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        name + ', No. ' + String(profile.jersey || '').trim() + ', ' + sport +
        ', class of ' + String(profile.classYear || '').trim() + '. Verified athletic testing, ' +
        'season averages, academics, film and tournament schedule.'
      );
    }

    var mark = $('wordmarkMark');
    if (mark) mark.textContent = initialsOf(profile.name);

    var wordmarkText = $('wordmarkText');
    if (wordmarkText) {
      wordmarkText.textContent = has(profile.classYear)
        ? sport + ' ' + String(profile.classYear).trim()
        : sport;
    }
  }

  /* ---------- 1. Hero ---------- */

  function renderHero() {
    var profile = D.profile || {};

    var eyebrow = $('heroEyebrow');
    var eyebrowParts = [profile.sport, profile.pursuit].filter(has);
    if (eyebrowParts.length) eyebrow.textContent = eyebrowParts.join(' · ');
    else eyebrow.hidden = true;

    var pill = $('heroBadgePill');
    var pillParts = [];
    if (has(profile.position)) pillParts.push(profile.position);
    if (has(profile.classYear)) pillParts.push('Class of ' + profile.classYear);
    if (pillParts.length) pill.textContent = pillParts.join(' · ');
    else pill.hidden = true;

    var nameEl = $('heroName');
    if (has(profile.name)) {
      nameEl.innerHTML = esc(profile.name) +
        (has(profile.jersey) ? ' <span class="hero__jersey">#' + esc(profile.jersey) + '</span>' : '');
    }

    var team = $('heroTeam');
    var teamParts = [profile.school, profile.club].filter(has);
    if (teamParts.length) team.textContent = teamParts.join(' · ');
    else team.hidden = true;

    var facts = [
      { label: 'Height / weight', value: profile.heightWeight },
      { label: 'Based in', value: profile.city },
      { label: 'NCAA eligibility ID', value: has(profile.ncaaId) ? '#' + profile.ncaaId : '' },
      { label: 'NAIA ECID', value: has(profile.naiaId) ? '#' + profile.naiaId : '' }
    ].filter(function (fact) {
      return has(fact.value);
    });

    var factsList = $('heroFacts');
    if (facts.length) {
      factsList.innerHTML = facts.map(function (fact) {
        return '<div class="hero__fact">' +
          '<dt>' + esc(fact.label) + '</dt>' +
          '<dd>' + esc(fact.value) + '</dd>' +
          '</div>';
      }).join('');
    } else {
      factsList.hidden = true;
    }

    var resumeLink = $('resumeLink');
    if (has(profile.resumeUrl)) {
      resumeLink.setAttribute('href', String(profile.resumeUrl).trim());
      resumeLink.setAttribute('download', '');
    } else {
      resumeLink.hidden = true;
    }

    renderHeroMedia();
    renderHeroReel();
  }

  /* Local action photo first, warm monogram placeholder last, so a file that
     is not there yet never shows a broken image icon. */
  function renderHeroMedia() {
    var hero = D.hero || {};
    var profile = D.profile || {};
    var frame = $('mediaFrameInner');

    var caption = $('mediaFrameCaption');
    if (has(hero.caption)) caption.textContent = hero.caption;
    else caption.hidden = true;

    function placeholder() {
      frame.innerHTML = '<div class="mediaFrame__placeholder">' +
        '<span class="mediaFrame__monogram" aria-hidden="true">' + esc(initialsOf(profile.name)) + '</span>' +
        '<span class="mediaFrame__sport">' +
          esc([profile.sport, has(profile.classYear) ? 'Class of ' + profile.classYear : '']
            .filter(has).join(' · ')) +
        '</span>' +
        '</div>';
    }

    if (has(hero.poster)) {
      var image = document.createElement('img');
      image.className = 'mediaFrame__media';
      image.src = String(hero.poster).trim();
      image.alt = has(hero.posterAlt) ? hero.posterAlt : String(profile.name || '');
      image.setAttribute('decoding', 'async');
      image.setAttribute('fetchpriority', 'high');
      image.addEventListener('error', placeholder);

      frame.innerHTML = '';
      frame.appendChild(image);
      return;
    }

    placeholder();
  }

  /* Play trigger layered over the photo. Opens the same player as the film
     grid, so there is one code path and one modal. */
  function renderHeroReel() {
    var button = $('heroReelButton');
    if (!button) return;

    var hero = D.hero || {};
    var reel = byId(clipList(), hero.reelClip);

    if (!reel) {
      button.hidden = true;
      return;
    }

    button.hidden = false;
    $('heroReelLabel').textContent = has(hero.reelLabel) ? hero.reelLabel : 'Watch film';
    $('heroReelMeta').textContent = [reel.duration, formatDate(reel.date)].filter(has).join(' · ');

    button.addEventListener('click', function () {
      openClip(reel, button);
    });
  }

  /* ---------- 2. Verified athletic testing ---------- */

  function metricCardHtml(item) {
    return '<article class="metricCard">' +
      '<p class="metricCard__badge">' + CHECK_SVG + 'Verified</p>' +
      '<p class="metricCard__values">' +
        '<span class="metricCard__value">' + esc(item.primary) + '</span>' +
        (has(item.unit) ? '<span class="metricCard__unit">' + esc(item.unit) + '</span>' : '') +
      '</p>' +
      '<h3 class="metricCard__label">' + esc(item.label) + '</h3>' +
      (has(item.detail) ? '<p class="metricCard__detail">' + esc(item.detail) + '</p>' : '') +
      '</article>';
  }

  function renderMeasurables() {
    var section = $('measurables');
    var metrics = listFrom(D.measurables).filter(function (item) {
      return item && has(item.label) && has(item.primary);
    });

    var grid = $('metricGrid');
    if (metrics.length) {
      grid.innerHTML = metrics.map(metricCardHtml).join('');
    } else {
      grid.hidden = true;
    }

    var verification = D.verification || {};
    var lede = $('measurablesLede');
    var parts = [
      has(verification.label) ? verification.label + '.' : '',
      verification.note,
      verification.method
    ];
    lede.textContent = parts.filter(has).join(' ');

    if (!metrics.length) section.hidden = true;
  }

  /* ---------- 3. Offense vs defense ---------- */

  function rowsHtml(rows) {
    return rows.map(function (row) {
      return '<div class="row">' +
        '<dt class="row__label">' + esc(row.label) + '</dt>' +
        '<dd class="row__value">' + esc(row.value) + '</dd>' +
        '</div>';
    }).join('');
  }

  function phasePanelHtml(panel, splits) {
    var rows = listFrom(panel.rows).filter(function (row) {
      return row && has(row.label) && has(row.value);
    });

    var html = '<p class="phasePanel__meta">' +
      esc([splits.season, panel.phase].filter(has).join(' · ')) + '</p>';

    if (rows.length) html += '<dl class="rows">' + rowsHtml(rows) + '</dl>';
    if (has(panel.note)) html += '<p class="phaseNote">' + esc(panel.note) + '</p>';

    return html;
  }

  /* Marks the two strip numbers that belong to the active phase. */
  function markActivePhase(phase) {
    var items = $('statStrip').querySelectorAll('.statStrip__item');
    Array.prototype.forEach.call(items, function (item) {
      item.classList.toggle('is-active', item.getAttribute('data-phase') === phase);
    });
  }

  function renderSplits() {
    var splits = D.splits || {};
    var strip = listFrom(splits.strip).filter(function (item) {
      return item && has(item.label) && has(item.value) && has(item.phase);
    });
    var panels = listFrom(splits.panels).filter(function (panel) {
      return panel && has(panel.id) && has(panel.label);
    });
    var section = $('splits');

    if (!strip.length || !panels.length) {
      section.hidden = true;
      return;
    }

    $('statStrip').innerHTML = strip.map(function (item) {
      return '<div class="statStrip__item" data-phase="' + esc(item.phase) + '">' +
        '<span class="statStrip__value">' + esc(item.value) + '</span>' +
        '<span class="statStrip__label">' + esc(item.label) + '</span>' +
        '</div>';
    }).join('');

    $('splitTabs').innerHTML = panels.map(function (panel, index) {
      return '<button class="tab" type="button" role="tab" id="splitTab' + index + '" ' +
        'data-value="' + esc(panel.id) + '" aria-controls="splitPanel" ' +
        'aria-selected="' + (index === 0 ? 'true' : 'false') + '" ' +
        'tabindex="' + (index === 0 ? '0' : '-1') + '">' + esc(panel.label) + '</button>';
    }).join('');

    initTablist($('splitTabs'), $('splitPanel'), function (value) {
      var panel = byId(panels, value) || panels[0];
      $('splitPanel').innerHTML = phasePanelHtml(panel, splits);
      flashPanel($('splitPanel'));
      markActivePhase(panel.id);
    }, true);
  }

  /* ---------- 4. Academics and Olympic pursuit ---------- */

  function renderAcademics() {
    var academics = D.academics || {};
    var card = $('academicCard');

    var facts = listFrom(academics.facts).filter(function (fact) {
      return fact && has(fact.label) && has(fact.value);
    });
    var honors = listFrom(academics.honors).filter(has);
    var documents = listFrom(academics.documents).filter(function (doc) {
      return doc && has(doc.label) && has(doc.url);
    });
    var pursuit = academics.pursuit || {};

    if (!has(academics.gpa) && !facts.length && !honors.length && !documents.length) {
      $('academics').hidden = true;
      return;
    }

    /* Left panel: GPA and headline status */
    var score = '<div class="academicCard__score">' +
      '<p class="gpaLabel">Grade point average</p>' +
      '<div class="gpaValue">' +
        '<span class="gpaValue__number">' + esc(academics.gpa) + '</span>' +
        (has(academics.gpaScale) ? '<span class="gpaValue__scale">' + esc(academics.gpaScale) + '</span>' : '') +
      '</div>';

    var pills = '';
    if (has(academics.honorRoll)) pills += '<span class="pill">' + esc(academics.honorRoll) + '</span>';
    if (has(pursuit.target)) pills += '<span class="pill pill--accent">' +
      '<span class="pill__dot" aria-hidden="true"></span>' + esc(pursuit.target) + '</span>';
    if (pills) score += '<div class="gpaMeta">' + pills + '</div>';
    score += '</div>';

    /* Right panel: pursuit, IDs, honours, documents */
    var body = '<div class="academicCard__body">';

    if (has(pursuit.target)) {
      body += '<div class="pursuit">' +
        '<p class="pursuit__label">' + esc(has(pursuit.label) ? pursuit.label : 'Olympic pursuit') + '</p>' +
        '<p class="pursuit__target">' + esc(pursuit.target) + '</p>' +
        (has(pursuit.note) ? '<p class="pursuit__note">' + esc(pursuit.note) + '</p>' : '') +
        '</div>';
    }

    if (facts.length) {
      body += '<p class="academicSub">Eligibility and records</p>' +
        '<div class="factGrid">' + facts.map(function (fact) {
          return '<div class="factTile">' +
            '<p class="factTile__label">' + esc(fact.label) + '</p>' +
            '<p class="factTile__value">' + esc(fact.value) + '</p>' +
            '</div>';
        }).join('') + '</div>';
    }

    if (honors.length) {
      body += '<p class="academicSub">Honours and medals</p>' +
        '<ul class="honors">' + honors.map(function (honor) {
          return '<li>' + esc(honor) + '</li>';
        }).join('') + '</ul>';
    }

    if (documents.length) {
      body += '<p class="academicSub">Documents</p><div class="linkList">' +
        documents.map(function (doc) {
          return '<a class="linkRow" href="' + esc(doc.url) + '" download>' +
            '<span class="linkRow__text">' +
              '<span class="linkRow__label">' + esc(doc.label) + '</span>' +
              (has(doc.detail) ? '<span class="linkRow__detail">' + esc(doc.detail) + '</span>' : '') +
            '</span>' +
            '<span class="linkRow__icon" aria-hidden="true">' + ARROW_SVG + '</span>' +
            '</a>';
        }).join('') + '</div>';
    }

    body += '</div>';

    card.innerHTML = score + body;
  }

  /* ---------- 5. Film room ---------- */

  /* The one place clips and filter tabs are derived from data, shared by the
     film grid and the hero play button. */
  function clipList() {
    return listFrom((D.film || {}).clips).filter(function (clip) {
      return clip && has(clip.id) && has(clip.title) && has(youtubeId(clip.youtubeId));
    });
  }

  function filmCategories() {
    var clips = clipList();
    return listFrom((D.film || {}).categories).filter(function (category) {
      return category && has(category.id) && has(category.label);
    }).filter(function (category) {
      return category.id === 'all' || clips.some(function (clip) {
        return clip.category === category.id;
      });
    });
  }

  function filmCardHtml(clip) {
    var id = youtubeId(clip.youtubeId);
    var thumbnail = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    var fallback = 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg';

    return '<article class="vcard">' +
      '<div class="vcard__media">' +
        '<button class="vcard__thumb" type="button" data-clip="' + esc(clip.id) + '" ' +
          'data-fallback="' + esc(fallback) + '" aria-label="Play ' + esc(clip.title) + '">' +
          '<img src="' + esc(thumbnail) + '" alt="" loading="lazy" decoding="async">' +
          '<span class="vcard__play" aria-hidden="true">' + PLAY_SVG + '</span>' +
          (has(clip.duration) ? '<span class="vcard__duration">' + esc(clip.duration) + '</span>' : '') +
        '</button>' +
      '</div>' +
      '<div class="vcard__body">' +
        '<h3 class="vcard__title">' + esc(clip.title) + '</h3>' +
        '<p class="vcard__meta">' +
          (has(clip.date) ? '<span class="tagChip">' + esc(formatDate(clip.date)) + '</span>' : '') +
          (has(clip.note) ? '<span>' + esc(clip.note) + '</span>' : '') +
        '</p>' +
      '</div>' +
      '</article>';
  }

  function bindThumbnails(scope) {
    var images = scope.querySelectorAll('.vcard__thumb img');
    Array.prototype.forEach.call(images, function (image) {
      image.addEventListener('error', function () {
        if (!image.getAttribute('data-tried')) {
          image.setAttribute('data-tried', '1');
          var button = image.closest ? image.closest('.vcard__thumb') : null;
          if (button) image.src = button.getAttribute('data-fallback');
        } else {
          image.remove(); /* the dark media frame and play button remain */
        }
      });
    });
  }

  function renderClips(clips, category) {
    var grid = $('videoGrid');
    var list = category === 'all' ? clips : clips.filter(function (clip) {
      return clip.category === category;
    });

    grid.innerHTML = list.map(filmCardHtml).join('');
    bindThumbnails(grid);
    flashPanel(grid);
  }

  function renderFilm() {
    var clips = clipList();
    var categories = filmCategories();
    var section = $('film');

    if (!clips.length || !categories.length) {
      section.hidden = true;
      return;
    }

    $('filmLede').textContent = clips.length + ' clips of route running, YAC, flag pulls and ' +
      'coverage, plus tournament reels. Every clip carries its date, so recruiters can match film ' +
      'to the schedule below. Select any card to play it here.';

    $('filmTabs').innerHTML = categories.map(function (category, index) {
      return '<button class="tab" type="button" role="tab" id="filmTab' + index + '" ' +
        'data-value="' + esc(category.id) + '" aria-controls="videoGrid" ' +
        'aria-selected="' + (index === 0 ? 'true' : 'false') + '" ' +
        'tabindex="' + (index === 0 ? '0' : '-1') + '">' + esc(category.label) + '</button>';
    }).join('');

    initTablist($('filmTabs'), $('videoGrid'), function (value) {
      renderClips(clips, value);
    }, true);

    $('videoGrid').addEventListener('click', function (event) {
      var button = event.target.closest ? event.target.closest('.vcard__thumb') : null;
      if (!button) return;
      var clip = byId(clips, button.getAttribute('data-clip'));
      if (clip) openClip(clip, button);
    });

    initFilmDialog();
  }

  /* ---------- film player modal ---------- */

  function initFilmDialog() {
    var dialog = $('filmDialog');
    if (!dialog) return;

    $('filmDialogClose').addEventListener('click', function () {
      closeClip(dialog);
    });

    /* Clicking the backdrop lands on the dialog element itself. */
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeClip(dialog);
    });

    dialog.addEventListener('close', function () {
      releasePlayer(dialog);
    });
  }

  function openClip(clip, trigger) {
    var dialog = $('filmDialog');
    if (!dialog) return;

    var categories = filmCategories();
    var category = null;
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === clip.category) category = categories[i];
    }

    var eyebrowParts = [];
    if (has(clip.duration)) eyebrowParts.push(clip.duration);
    if (category && has(category.label)) eyebrowParts.push(category.label);
    $('filmDialogEyebrow').textContent = eyebrowParts.join(' · ');

    $('filmDialogTitle').textContent = clip.title;

    var noteParts = [];
    if (has(clip.date)) noteParts.push(formatDate(clip.date));
    if (has(clip.note)) noteParts.push(clip.note);
    noteParts.push('Film plays through YouTube. Use the player controls to scrub or go full screen.');
    $('filmDialogNote').textContent = noteParts.join(' · ');

    var frame = $('filmDialogFrame');
    frame.innerHTML = '';

    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + youtubeId(clip.youtubeId) +
      '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = clip.title;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', '');
    frame.appendChild(iframe);

    lastTrigger = trigger || null;
    document.documentElement.classList.add('is-locked');

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function closeClip(dialog) {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    /* The native close event is asynchronous, so release here too.
       releasePlayer is idempotent. */
    releasePlayer(dialog);
  }

  /* Clearing the frame unmounts the iframe, which stops playback. */
  function releasePlayer() {
    var frame = $('filmDialogFrame');
    if (frame) frame.innerHTML = '';
    document.documentElement.classList.remove('is-locked');
    if (lastTrigger && document.body.contains(lastTrigger)) lastTrigger.focus();
    lastTrigger = null;
  }

  /* ---------- shared tab behaviour ---------- */

  function flashPanel(element) {
    if (!element || !element.classList || prefersReducedMotion()) return;
    element.classList.remove('is-entering');
    void element.offsetWidth; /* restart the animation */
    element.classList.add('is-entering');
  }

  function initTablist(tablist, panel, onSelect, selectFirst) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function activate(index, moveFocus) {
      var safe = Math.max(0, Math.min(index, tabs.length - 1));
      tabs.forEach(function (tab, tabIndex) {
        var isActive = tabIndex === safe;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      panel.setAttribute('aria-labelledby', tabs[safe].id);
      onSelect(tabs[safe].getAttribute('data-value'));
      if (moveFocus) tabs[safe].focus();
    }

    tablist.addEventListener('click', function (event) {
      var tab = event.target.closest ? event.target.closest('[role="tab"]') : null;
      if (!tab) return;
      activate(tabs.indexOf(tab));
    });

    tablist.addEventListener('keydown', function (event) {
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;

      var next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;

      event.preventDefault();
      activate(next, true);
    });

    if (selectFirst) activate(0);
  }

  /* ---------- 6. Schedule ---------- */

  function renderSchedule() {
    var items = listFrom(D.schedule).filter(function (item) {
      return item && has(item.date) && has(item.event);
    });
    var section = $('schedule');

    if (!items.length) {
      section.hidden = true;
      return;
    }

    $('scheduleBody').innerHTML = items.map(function (item) {
      var days = dayCount(item.date, item.endDate);
      return '<tr>' +
        '<td data-label="Date">' +
          '<span class="scheduleDate">' + esc(formatRange(item.date, item.endDate)) + '</span>' +
          (days > 1 ? '<span class="scheduleBadge">' + days + ' day event</span>' : '') +
        '</td>' +
        '<td data-label="Event"><span class="eventName">' + esc(item.event) + '</span></td>' +
        '<td data-label="Location"><span class="eventLocation">' + esc(item.location) + '</span></td>' +
        '<td data-label="Team"><span class="eventTeam">' + esc(item.team) + '</span></td>' +
        '</tr>';
    }).join('');

    var note = $('scheduleNote');
    note.textContent = 'Dates and venues are confirmed by Durham Elite Academy and Team Ontario. ' +
      'Programmes attending should check back one week out.';
  }

  /* ---------- 7. Contacts ---------- */

  function renderContacts() {
    var contacts = listFrom(D.contacts).filter(function (contact) {
      return contact && has(contact.name);
    });
    var section = $('contact');

    if (!contacts.length) {
      section.hidden = true;
      return;
    }

    $('contactGrid').innerHTML = contacts.map(function (contact) {
      var tel = telHref(contact.phone);
      var actions = '';

      /* Addresses are printed on the buttons themselves so they can be read
         and copied, not only clicked. */
      if (tel) {
        actions += '<a class="btn btn--primary btn--small" href="tel:' + esc(tel) + '">Call ' +
          esc(contact.phone) + '</a>';
      }
      if (has(contact.email)) {
        actions += '<a class="btn btn--accent btn--small" href="mailto:' + esc(contact.email) + '">' +
          esc(contact.email) + '</a>';
      }
      listFrom(contact.links).forEach(function (link) {
        if (!link || !has(link.url)) return;
        actions += '<a class="btn btn--ghost btn--small" href="' + esc(link.url) +
          '" target="_blank" rel="noopener noreferrer">' + esc(link.label) + '</a>';
      });

      return '<article class="contactCard">' +
        '<p class="contactCard__role">' + esc(contact.role) + '</p>' +
        '<h3 class="contactCard__name">' + esc(contact.name) + '</h3>' +
        (has(contact.detail) ? '<p class="contactCard__detail">' + esc(contact.detail) + '</p>' : '') +
        (actions ? '<div class="contactCard__actions">' + actions + '</div>' : '') +
        (has(contact.note) ? '<p class="contactCard__note">' + esc(contact.note) + '</p>' : '') +
        '</article>';
    }).join('');
  }

  /* ---------- 8. Footer ---------- */

  function renderFooter() {
    var profile = D.profile || {};
    var site = D.site || {};

    $('footerName').textContent = has(profile.name) ? profile.name : '';

    var descParts = [profile.position, profile.school, profile.club].filter(has);
    if (has(profile.classYear)) descParts.push('Class of ' + profile.classYear);
    var desc = $('footerDesc');
    desc.textContent = descParts.join(' · ');
    if (!desc.textContent) desc.hidden = true;

    var socials = listFrom(D.social).filter(function (entry) {
      return entry && has(entry.label) && has(entry.url);
    });

    var socialBox = $('footerSocial');
    if (socials.length) {
      socialBox.innerHTML = socials.map(function (entry) {
        return '<a href="' + esc(entry.url) + '" target="_blank" rel="noopener noreferrer">' +
          esc(entry.label) + '</a>';
      }).join('');
    } else {
      socialBox.hidden = true;
    }

    var idParts = [];
    if (has(profile.ncaaId)) idParts.push('NCAA #' + profile.ncaaId);
    if (has(profile.naiaId)) idParts.push('NAIA ECID #' + profile.naiaId);
    $('footerCompliance').textContent = idParts.length ? idParts.join(' · ') : 'NCAA and NAIA eligible';

    var copyright = $('copyright');
    copyright.textContent = '© ' + new Date().getFullYear() +
      (has(profile.name) ? ' ' + profile.name : '') + '. All rights reserved.';

    var prepared = $('footerPrepared');
    prepared.textContent = has(site.preparedBy)
      ? 'Recruiting profile prepared by ' + site.preparedBy + '.'
      : '';
    if (!prepared.textContent) prepared.hidden = true;
  }

  /* ---------- navigation ---------- */

  function initNav() {
    var nav = $('nav');
    var toggle = $('navToggle');
    var menu = $('navMenu');

    function setOpen(open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Shadow only once the page has moved, so the top of the page stays flat. */
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        nav.classList.toggle('is-stuck', window.pageYOffset > 6);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length || typeof IntersectionObserver === 'undefined') return;

    var sections = [];
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.push({ link: link, section: section });
    });
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (pair) {
          pair.link.classList.toggle('is-active', pair.section === entry.target);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (pair) {
      observer.observe(pair.section);
    });
  }

  /* Links pointing at a section that removed itself would do nothing. */
  function hideDeadLinks() {
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target || target.hidden) link.hidden = true;
    });

    var actions = $('heroActions');
    var visible = Array.prototype.filter.call(actions.children, function (child) {
      return !child.hidden;
    });
    if (!visible.length) actions.hidden = true;
  }

  /* ---------- boot ---------- */

  function init() {
    applyTheme();
    applyTitle();
    renderHero();
    renderMeasurables();
    renderSplits();
    renderAcademics();
    renderFilm();
    renderSchedule();
    renderContacts();
    renderFooter();
    initNav();
    initScrollSpy();
    hideDeadLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

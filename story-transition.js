/* Story transition: reads config and intro text from #story-mount, builds everything else. */
(function () {
  var mount = document.getElementById('story-mount');
  if (!mount) { console.error('story-transition: #story-mount not found'); return; }

  var STORY_URL = mount.getAttribute('data-story-url');
  var COVER_HEADER = mount.getAttribute('data-cover-header') !== 'false';
  var FADE_LIGHT = [0.35, 0.75];
  var FADE_DARK = [0.05, 0.45];
  var STORY_ORIGIN = new URL(STORY_URL).origin;

  var introHTML = mount.innerHTML;
  mount.innerHTML = '';

  var css = [
    '#story-wrap{position:relative;z-index:1002;width:100vw;margin-left:calc(50% - 50vw);}',
    '#story-intro{min-height:100vh;min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 24px;opacity:0;}',
    '#story-intro h2{font:700 clamp(2rem,6vw,4rem)/1.1 system-ui,sans-serif;margin:0 0 .5em;color:#fff;}',
    '#story-intro p{max-width:34ch;font-size:1.25rem;margin:0;opacity:.85;color:#fff;}',
    '#story-pin{height:600vh;}',
    '#story-frame{position:fixed;top:0;left:0;width:100%;height:100vh;height:100svh;border:0;display:none;background:#0b0d12;z-index:1000;}',
    '#story-overlay{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1001;background:#0b0d12;opacity:0;pointer-events:none;}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var wrap = document.createElement('section');
  wrap.id = 'story-wrap';
  wrap.innerHTML =
    '<div id="story-intro">' + introHTML + '</div>' +
    '<div id="story-pin"></div>';
  mount.appendChild(wrap);

  var pin = wrap.querySelector('#story-pin');
  var intro = wrap.querySelector('#story-intro');

  // The iframe itself sits directly on <body>, just like the overlay
  // below - so no WordPress theme container (or its sticky header) can
  // ever end up rendering on top of it, no matter what stacking context
  // the post content lives inside. Its position/visibility is driven
  // entirely from JS in update(), replacing what position:sticky used to
  // do for it while it was nested inside #story-pin.
  var frame = document.createElement('iframe');
  frame.id = 'story-frame';
  frame.title = 'Interactive story';
  frame.scrolling = 'no';
  document.body.appendChild(frame);

  // Overlay sits directly on <body> so theme containers can't break position:fixed
  var overlay = document.createElement('div');
  overlay.id = 'story-overlay';
  document.body.appendChild(overlay);

  if (!COVER_HEADER) { overlay.style.zIndex = 900; wrap.style.zIndex = 901; frame.style.zIndex = 800; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v) { return Math.min(1, Math.max(0, v)); }
  function ease(t) { return t * t * (3 - 2 * t); }

  var ticking = false, lastProgress = -1, theme = 'light';

  function detectTheme() {
    var nodes = [document.body, document.documentElement];
    for (var i = 0; i < nodes.length; i++) {
      var m = getComputedStyle(nodes[i]).backgroundColor.match(/[\d.]+/g) || [];
      var c = m.map(Number);
      if (c.length >= 3 && (c.length === 3 || c[3] > 0.5)) {
        return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255 < 0.5 ? 'dark' : 'light';
      }
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncTheme() {
    var t = detectTheme();
    if (t === theme && wrap.getAttribute('data-theme')) return;
    theme = t;
    wrap.setAttribute('data-theme', t);
    if (frame.contentWindow) frame.contentWindow.postMessage({ type: 'theme', theme: t }, STORY_ORIGIN);
    schedule();
  }
  function syncThemeSoon() { syncTheme(); setTimeout(syncTheme, 450); }
  var opts = { attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-mode', 'data-bs-theme'] };
  new MutationObserver(syncThemeSoon).observe(document.documentElement, opts);
  new MutationObserver(syncThemeSoon).observe(document.body, opts);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeSoon);

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var w = wrap.getBoundingClientRect();
    var p = pin.getBoundingClientRect();

    var enter = clamp((vh - w.top) / vh);
    var exit = clamp(w.bottom / vh);
    var dark = Math.min(enter, exit);
    overlay.style.opacity = reduce ? (dark > 0.5 ? 1 : 0) : ease(dark);

    var range = theme === 'dark' ? FADE_DARK : FADE_LIGHT;
    var textIn = clamp((enter - range[0]) / (range[1] - range[0]));
    intro.style.opacity = reduce ? (textIn > 0.5 ? 1 : 0) : textIn;

    // Replaces what position:sticky used to do automatically: stay
    // pinned to the top of the viewport while scrolling through the
    // pin's height, then hide before it starts / once it's fully past
    // (sliding out with it right at the end, like sticky would).
    if (p.top > 0 || p.bottom < 0) {
      frame.style.display = 'none';
    } else {
      frame.style.display = 'block';
      frame.style.top = (p.bottom < vh ? p.bottom - vh : 0) + 'px';
    }

    var total = p.height - vh;
    var progress = total > 0 ? clamp(-p.top / total) : 0;
    if (progress !== lastProgress && frame.contentWindow) {
      lastProgress = progress;
      frame.contentWindow.postMessage({ type: 'story-progress', progress: progress }, STORY_ORIGIN);
    }
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  frame.addEventListener('load', function () {
    lastProgress = -1;
    frame.contentWindow.postMessage({ type: 'theme', theme: theme }, STORY_ORIGIN);
    schedule();
  });
  window.addEventListener('message', function (e) {
    if (e.origin !== STORY_ORIGIN || !e.data || e.data.type !== 'story-height') return;
    var h = Number(e.data.height);
    if (h > 0) { pin.style.height = h + 'px'; schedule(); }
  });

  frame.src = STORY_URL;
  syncTheme();
  update();
})();

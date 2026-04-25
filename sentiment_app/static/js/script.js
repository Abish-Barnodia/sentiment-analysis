/**
 * SentiScope — Main UI Controller
 * Design System: The Luminous Observer (Stitch MCP)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Element refs ──────────────────────────────── */
  const textInput        = document.getElementById('text-input');
  const charCountEl      = document.getElementById('char-count');
  const analyzeBtn       = document.getElementById('analyze-btn');
  const btnText          = analyzeBtn.querySelector('span');
  const btnIcon          = analyzeBtn.querySelector('i');

  const placeholderPanel = document.getElementById('results-placeholder');
  const loadingPanel     = document.getElementById('results-loading');
  const resultsPanel     = document.getElementById('results-card');

  const resultEmoji      = document.getElementById('result-emoji');
  const resultSentiment  = document.getElementById('result-sentiment');
  const polarityVal      = document.getElementById('polarity-val');
  const polarityBar      = document.getElementById('polarity-bar');
  const subjectivityVal  = document.getElementById('subjectivity-val');
  const subjectivityBar  = document.getElementById('subjectivity-bar');
  const wordCountEl      = document.getElementById('word-count');
  const charCountResult  = document.getElementById('char-count-result');
  const latencyValEl     = document.getElementById('latency-val');
  const timingInfo       = document.getElementById('timing-info');

  /* ── Char count input handler ───────────────────── */
  textInput.addEventListener('input', updateCharCount);
  updateCharCount(); // init

  function updateCharCount() {
    const len = textInput.value.length;
    charCountEl.textContent = len;

    // Reset classes
    charCountEl.classList.remove('warn','danger');

    if (len > 5000) {
      charCountEl.classList.add('danger');
      analyzeBtn.disabled = true;
    } else if (len > 4500) {
      charCountEl.classList.add('warn');
      analyzeBtn.disabled = (len === 0);
    } else {
      analyzeBtn.disabled = (len === 0);
    }
  }

  /* ── Analyze button ─────────────────────────────── */
  analyzeBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    if (!text) return;

    showLoadingState();

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const data = await response.json();

      // Premium feel: slight delay before reveal
      setTimeout(() => displayResults(data), 550);

    } catch (error) {
      console.error('SentiScope error:', error);
      handleError(error.message);
    }
  });

  /* ── State: Loading ─────────────────────────────── */
  function showLoadingState() {
    analyzeBtn.disabled = true;
    btnText.textContent = 'Analyzing…';
    btnIcon.className   = 'fa-solid fa-spinner fa-spin';

    placeholderPanel.classList.add('hidden');
    resultsPanel.classList.add('hidden');
    loadingPanel.classList.remove('hidden');
    resultsPanel.classList.remove('is-positive', 'is-negative', 'is-neutral');

    // Reset gauges
    polarityBar.style.width = '50%';
    subjectivityBar.style.width = '0%';
  }

  /* ── State: Results ─────────────────────────────── */
  function displayResults(data) {
    // Reset button
    analyzeBtn.disabled = false;
    btnText.textContent  = 'Analyze Sentiment';
    btnIcon.className    = 'fa-solid fa-wand-magic-sparkles';

    // Swap panels
    loadingPanel.classList.add('hidden');
    resultsPanel.classList.remove('hidden');

    // Sentiment classification
    resultEmoji.textContent     = data.emoji;
    resultSentiment.textContent = data.sentiment;
    resultsPanel.classList.add(`is-${data.color_class}`);

    // Emoji spring bounce
    resultEmoji.style.transform = 'scale(0.7)';
    setTimeout(() => { resultEmoji.style.transform = 'scale(1)'; resultEmoji.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'; }, 50);

    // Polarity gauge — map −1…+1 to 0%…100%
    const polPercentage = Math.max(0, Math.min(100, ((data.polarity + 1) / 2) * 100));
    polarityVal.textContent = data.polarity >= 0 ? `+${data.polarity.toFixed(2)}` : data.polarity.toFixed(2);

    // Polarity bar color by class
    if (data.color_class === 'positive')      polarityBar.style.background = 'var(--positive)';
    else if (data.color_class === 'negative') polarityBar.style.background = 'var(--negative)';
    else                                      polarityBar.style.background = 'var(--neutral-col)';

    // Subjectivity gauge
    const subPercentage = Math.max(0, Math.min(100, data.subjectivity * 100));
    subjectivityVal.textContent = data.subjectivity.toFixed(2);

    // Animate bars after tiny tick
    setTimeout(() => {
      polarityBar.style.width     = `${polPercentage}%`;
      subjectivityBar.style.width = `${subPercentage}%`;
    }, 60);

    // Detail stats
    wordCountEl.textContent    = data.word_count.toLocaleString();
    charCountResult.textContent = data.char_count.toLocaleString();
    latencyValEl.textContent   = `${data.processing_time_ms}ms`;

    timingInfo.textContent = `Verified · Processed in ${data.processing_time_ms}ms`;
  }

  /* ── State: Error ───────────────────────────────── */
  function handleError(msg) {
    analyzeBtn.disabled = false;
    btnText.textContent  = 'Retry Analysis';
    btnIcon.className    = 'fa-solid fa-rotate-right';

    loadingPanel.classList.add('hidden');
    placeholderPanel.classList.remove('hidden');

    const icon = placeholderPanel.querySelector('i');
    const text = placeholderPanel.querySelector('p');
    if (icon) icon.className = 'fa-solid fa-triangle-exclamation icon-xl';
    if (icon) icon.style.opacity = '0.6';
    if (icon) icon.style.color = 'var(--negative)';
    if (text) text.textContent = msg || 'Connection to intelligence engine failed.';
  }

  /* ── Misc link handlers ─────────────────────────── */
  const btnSearch = document.getElementById('btn-search');
  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      alert('🔍 Search functionality coming in v2.0');
    });
  }

  const linkPrivacy = document.getElementById('link-privacy');
  if (linkPrivacy) {
    linkPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Privacy Policy:\n\nSentiScope does not store, log, or transmit your text. Analysis is processed in-memory and discarded immediately.');
    });
  }

});

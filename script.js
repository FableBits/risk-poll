// --- Per-metric configuration ---
// Each metric defines: its own answer-code -> label map, which poll years
// to skip (e.g. incompatible coding schemes), which codes are not eligible
// to be ranked/shown (e.g. "Other"/"Nothing"/"Don't know"/"Refused"), and
// how many top categories to show per panel (null = show all categories).
const metricsConfig = {
  Greatest_Risk: {
    labels: {
      1: "Road-related transport accidents/injuries",
      2: "Other transportation-related accidents/injuries",
      3: "Crime/Violence",
      4: "War/Terrorism",
      5: "Personal health condition/illness",
      6: "Drugs, alcohol, smoking",
      7: "COVID-19/Coronavirus related",
      8: "Mental stress/exhaustion",
      9: "Not having enough money",
      10: "Economy-related (unemployment, high prices)",
      11: "Politics/political situation/corruption",
      12: "Internet/technology related risks",
      13: "Water supply or unclean water",
      14: "Unsafe or contaminated food",
      15: "Insufficient food (hunger)",
      16: "Cooking/household accidents",
      17: "Work-related accidents",
      18: "Pollution",
      19: "Climate change/severe weather",
      20: "Non-weather-related disasters",
      21: "Drowning",
      22: "Other",
      23: "Nothing/No risks",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019], // 2019 uses an incompatible coding scheme for this metric
    excludeFromRanking: [22, 23, 98, 99],
    topN: 5
  },
  More_Safe: {
    labels: {
      1: "More safe",
      2: "Less safe",
      3: "About as safe",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [99],
    topN: null
  },
  Worried_Food: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [99],
    topN: null
  },
  Exp2Y_Food: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [99],
    topN: null
  },
  Worried_Water: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [99],
    topN: null
  },
  Exp2Y_Water: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [99],
    topN: null
  },
  Discrim_Color: {
    labels: {
      1: "Yes",
      2: "No",
      97: "Does not apply",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [97, 99],
    topN: null
  },
  Discrim_Gender: {
    labels: {
      1: "Yes",
      2: "No",
      97: "Does not apply",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [97, 99],
    topN: null
  },
  Resilience_idv: {
    labels: {
      0: "Least resilient",
      0.25: "Mildly Resilient",
      0.5: "Moderately Resilient",
      0.75: "Very Resilient",
      1: "Most Resilient"
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null
  },
  Resilience_com: {
    labels: {
      0: "Least Resilient",
      0.25: "Mildly Resilient",
      0.5: "Moderately Resilient",
      0.75: "Very Resilient",
      1: "Most Resilient"
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null,
    continuous: true
  },
};

// --- Config for current test: place and selected dimension ---
const currentCountry = "France";
const currentDimension = "Gender";
const currentDimensionValue = "2"; // stored as a numeric-looking string in the data

const dimensionValueLabels = {
  Gender: {
    "1": "Male",
    "2": "Female"
  }
};

// Known poll years across the whole dataset. Used when falling back to
// per-year country files (folder structure), since static hosting gives
// us no directory listing to discover years dynamically.
const ALL_KNOWN_YEARS = [2019, 2021, 2023, 2025];

// Dynamic, stable color assignment: the same category label always gets
// the same color once first encountered, reused across panels/metrics.
const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

function labelFor(metric, code) {
  const cfg = metricsConfig[metric];
  return (cfg.labels[code] !== undefined ? cfg.labels[code] : String(code));
}

// --- Data loading ---

async function loadCountryFile(metric, country) {
  // Try the flat "one file per country" layout first (all years merged).
  try {
    const flatRes = await fetch(`data/country/${metric}/${country}.json`);
    if (flatRes.ok) return flatRes.json();
  } catch (e) {
    // fall through to folder attempt
  }

  // Fallback: folder-per-country, one file per year. Missing years for a
  // given country are expected (not every country is polled every year),
  // so 404s/errors there just contribute no rows.
  const yearResults = await Promise.all(
    ALL_KNOWN_YEARS.map(async (year) => {
      try {
        const res = await fetch(`data/country/${metric}/${country}/${year}.json`);
        if (!res.ok) return [];
        return res.json();
      } catch (e) {
        return [];
      }
    })
  );
  return yearResults.flat();
}

async function loadGlobalYear(metric, year) {
  // Defensive: not every metric/year combination has a corresponding
  // glregion file. Treat a missing/broken file as "no data for this
  // year" rather than letting one bad fetch break the whole panel.
  try {
    const res = await fetch(`data/glregion/${metric}/Global/${year}/none.json`);
    if (!res.ok) return [];
    const rows = await res.json();
    // These files don't include a "year" field (it's implied by the
    // folder), so we attach it manually here.
    return rows.map((r) => ({ ...r, year }));
  } catch (e) {
    return [];
  }
}

// Rank categories by their average pct across the given rows (already
// scoped to years/dimension/etc. for one panel), excluding any codes the
// metric config says shouldn't be eligible for ranking (e.g. DK/Refused).
// Returns the top N codes (or all eligible codes if topN is null).
function rankTopCodes(rows, metric) {
  const cfg = metricsConfig[metric];
  const sums = {};

  rows.forEach((row) => {
    const code = Number(row.value_label);
    if (cfg.excludeFromRanking.includes(code)) return;
    if (!sums[code]) sums[code] = { sum: 0, count: 0 };
    sums[code].sum += row.pct;
    sums[code].count += 1;
  });

  const ranked = Object.entries(sums)
    .map(([code, { sum, count }]) => ({ code: Number(code), avg: sum / count }))
    .sort((a, b) => b.avg - a.avg);

  const codes = ranked.map((d) => d.code);
  return cfg.topN ? codes.slice(0, cfg.topN) : codes;
}

function bucketScore(value) {
  if (value < 0.2) return 0;
  if (value < 0.4) return 0.25;
  if (value < 0.6) return 0.5;
  if (value < 0.8) return 0.75;
  return 1;
}

function bucketRows(rows) {
  const grouped = {};
  rows.forEach((row) => {
    const bucket = bucketScore(Number(row.value_label));
    const key = `${row.year}|${row.dimension}|${row.dimension_value}|${bucket}`;
    if (!grouped[key]) {
      grouped[key] = { ...row, value_label: bucket, pct: 0 };
    }
    grouped[key].pct += row.pct;
  });
  return Object.values(grouped);
}

function buildSeries(rows, codes, metric, years) {
  const byLabel = {};
  codes.forEach((code) => {
    byLabel[labelFor(metric, code)] = new Array(years.length).fill(null);
  });

  rows.forEach((row) => {
    const code = Number(row.value_label);
    if (!codes.includes(code)) return;
    const label = labelFor(metric, code);
    const yearIndex = years.indexOf(row.year);
    if (yearIndex !== -1 && byLabel[label] !== undefined) {
      byLabel[label][yearIndex] = Math.round(row.pct * 100) / 100;
    }
  });

  return Object.entries(byLabel).map(([label, values]) => ({ label, values }));
}

async function loadMetricData(metric) {
  const cfg = metricsConfig[metric];
  const rawCountryRows = await loadCountryFile(metric, currentCountry);

  // Drop any years this metric excludes (e.g. incompatible coding scheme)
  // before we even compute which years exist.
  let countryRows = rawCountryRows.filter((r) => !cfg.skipYears.includes(r.year));
  if (cfg.continuous) countryRows = bucketRows(countryRows);

  const years = [...new Set(countryRows.map((r) => r.year))].sort((a, b) => a - b);

  // "own" panel: filtered to the selected dimension/value
  const ownRows = countryRows.filter(
    (r) => r.dimension === currentDimension && r.dimension_value === currentDimensionValue
  );

  // "country" panel: dimension === "none" (overall country average)
  const countryAvgRows = countryRows.filter(
    (r) => r.dimension === "none" && r.dimension_value === "none"
  );

  // "global" panel: one glregion fetch per included year, dimension_2 === "none"
  const globalRowsPerYear = await Promise.all(
    years.map((year) => loadGlobalYear(metric, year))
  );
  let globalRows = globalRowsPerYear
    .flat()
    .filter((r) => r.dimension_2 === "none" && r.dimension_2_value === "none");
  if (cfg.continuous) globalRows = bucketRows(globalRows);

  // Each panel picks its own top categories independently, ranked by
  // average pct across the included years.
  const ownCodes = rankTopCodes(ownRows, metric);
  const countryCodes = rankTopCodes(countryAvgRows, metric);
  const globalCodes = rankTopCodes(globalRows, metric);

  const chartData = {
    own: buildSeries(ownRows, ownCodes, metric, years),
    country: buildSeries(countryAvgRows, countryCodes, metric, years),
    global: buildSeries(globalRows, globalCodes, metric, years)
  };

  return { years, chartData };
}

// --- Metric switching / caching ---
const dataCache = {}; // metric -> { years, chartData }
let loadToken = 0;
let currentDisplayKey = null; // tracks whichever metric/combo is currently shown in the title

// Per-side state: "main" drives the single chart-area (Main Risks/More_Safe),
// "worry"/"experience" drive the split chart-area.
const sideState = {
  main:       { metric: null, years: [], chartData: { own: [], country: [], global: [] } },
  worry:      { metric: null, years: [], chartData: { own: [], country: [], global: [] } },
  experience: { metric: null, years: [], chartData: { own: [], country: [], global: [] } }
};

async function ensureMetricLoaded(metric) {
  if (!dataCache[metric]) {
    dataCache[metric] = await loadMetricData(metric);
  }
  return dataCache[metric];
}

// --- D3 chart drawing ---

function drawChart(svgSelector, seriesData, chartYears) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove();

  const node = svg.node();
  const width = node.clientWidth || 300;
  const height = node.clientHeight || 100;
  const margin = { top: 10, right: 10, bottom: 20, left: 30 };

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scalePoint()
    .domain(chartYears)
    .range([margin.left, width - margin.right]);

  const maxVal = d3.max(seriesData.flatMap(s => s.values.filter(v => v !== null))) || 10;
  const y = d3.scaleLinear()
    .domain([0, Math.min(100, maxVal * 1.2)]) // 20% headroom, capped at 100
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .defined((d) => d !== null)
    .x((d, i) => x(chartYears[i]))
    .y((d) => y(d));

  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .call((g) => g.selectAll("text").attr("fill", "#aaa").attr("font-size", "10px"))
    .call((g) => g.selectAll("line,path").attr("stroke", "#555"));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(4))
    .call((g) => g.selectAll("text").attr("fill", "#aaa").attr("font-size", "10px"))
    .call((g) => g.selectAll("line,path").attr("stroke", "#555"));

  seriesData.forEach((series) => {
    svg.append("path")
      .datum(series.values)
      .attr("fill", "none")
      .attr("stroke", colorScale(series.label))
      .attr("stroke-width", 2.5)
      .attr("d", line);

    svg.selectAll(`.label-${series.label.replace(/\W/g, "")}`)
      .data(series.values)
      .enter()
      .filter((d) => d !== null)
      .append("text")
      .attr("x", (d, i) => x(chartYears[i]))
      .attr("y", (d) => y(d) - 8)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", colorScale(series.label))
      .text((d) => d);

    svg.selectAll(`.dot-${series.label.replace(/\W/g, "")}`)
      .data(series.values)
      .enter()
      .filter((d) => d !== null)
      .append("circle")
      .attr("cx", (d, i) => x(chartYears[i]))
      .attr("cy", (d) => y(d))
      .attr("r", 3)
      .attr("fill", colorScale(series.label));
  });
}

function renderLegend(key, seriesData) {
  const container = document.querySelector(`.panel-legend[data-legend="${key}"]`);
  if (!container) return;
  container.innerHTML = "";
  seriesData.forEach((series) => {
    const item = document.createElement("span");
    item.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.backgroundColor = colorScale(series.label);

    const text = document.createElement("span");
    text.textContent = series.label;

    item.appendChild(swatch);
    item.appendChild(text);
    container.appendChild(item);
  });
}

const panelIds = {
  own: "panel-own",
  country: "panel-country",
  global: "panel-global",
  "own-worry": "panel-own-worry",
  "country-worry": "panel-country-worry",
  "global-worry": "panel-global-worry",
  "own-experience": "panel-own-experience",
  "country-experience": "panel-country-experience",
  "global-experience": "panel-global-experience"
};

function redrawPanel(key, side = "main") {
  const panelKey = side === "main" ? key : key.replace(`-${side}`, "");
  const data = sideState[side].chartData[panelKey];
  drawChart(`svg[data-series="${key}"]`, data, sideState[side].years);
  renderLegend(key, data);
}

// --- Crossfade logic:
// 1. Fade OUT every panel (opacity -> 0), wait for the fade to finish.
// 2. While invisible, instantly resize panels to the new stage AND
//    redraw their chart content at the new size (no visible deformation,
//    since nothing is visible at this moment).
// 3. Fade IN the panels that should be visible at this stage.
let transitionTokens = { main: 0, worry: 0, experience: 0 };

function showPanelsUpTo(stage, side = "main") {
  const myToken = ++transitionTokens[side];
  const suffix = side === "main" ? "" : `-${side}`;
  const allKeys = ["own", "country", "global"].map((k) => k + suffix);
  const allPanels = allKeys.map((k) => document.getElementById(panelIds[k]));

  // Step 1: fade everything out
  allPanels.forEach((p) => p.classList.remove("shown"));

  setTimeout(() => {
    if (myToken !== transitionTokens[side]) return; // a newer transition took over

    // Step 2: resize instantly (invisible) + redraw at final size
    allKeys.forEach((key, i) => {
      const shouldBeVisible = (i + 1) <= stage;
      const panel = allPanels[i];
      panel.classList.toggle("visible", shouldBeVisible);
    });

    // Let layout settle one frame before measuring/drawing
    requestAnimationFrame(() => {
      if (myToken !== transitionTokens[side]) return;
      allKeys.forEach((key, i) => {
        if ((i + 1) <= stage) redrawPanel(key, side);
      });

      // Step 3: fade the correct panels back in
      requestAnimationFrame(() => {
        if (myToken !== transitionTokens[side]) return;
        allKeys.forEach((key, i) => {
          if ((i + 1) <= stage) allPanels[i].classList.add("shown");
        });
      });
    });
  }, 460); // slightly longer than the 0.45s opacity transition
}

// --- Scrollama wiring ---
const titleEl = document.getElementById("question-title");
const categoryLinks = document.querySelectorAll(".category-link");

function setActiveCategory(category) {
  categoryLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.category === category);
  });
}

async function handleStepEnter(response) {
  const stepEl = response.element;
  const title = stepEl.dataset.title;
  const category = stepEl.dataset.category;
  const type = stepEl.dataset.type;
  const isSplit = category === "worry-experience";

  document.getElementById("chart-area").classList.toggle("active", !isSplit);
  document.getElementById("split-chart-area").classList.toggle("active", isSplit);

  const stage = type === "reveal-1" ? 1 : type === "reveal-2" ? 2 : type === "reveal-3" ? 3 : 0;

  function playTitleSwap() {
    titleEl.classList.remove("title-in", "title-out");
    void titleEl.offsetWidth;
    titleEl.classList.add("title-out");
    titleEl.onanimationend = () => {
      titleEl.onanimationend = null;
      titleEl.textContent = title;
      titleEl.classList.remove("title-out");
      void titleEl.offsetWidth;
      titleEl.classList.add("title-in");
    };
  }

  if (!isSplit) {
    const metric = stepEl.dataset.metric;
    if (metric && metric !== currentDisplayKey) {
      playTitleSwap();
      currentDisplayKey = metric;
      const myLoadToken = ++loadToken;
      const data = await ensureMetricLoaded(metric);
      if (myLoadToken !== loadToken) return;
      sideState.main.metric = metric;
      sideState.main.years = data.years;
      sideState.main.chartData = data.chartData;
    }
    setActiveCategory(category);
    showPanelsUpTo(stage, "main");
  } else {
    const worryMetric = stepEl.dataset.metricWorry;
    const expMetric = stepEl.dataset.metricExperience;
    const splitKey = `${worryMetric}|${expMetric}`;
    if (splitKey !== currentDisplayKey) {
      playTitleSwap();
      currentDisplayKey = splitKey;
    }
    const myLoadToken = ++loadToken;
    const [worryData, expData] = await Promise.all([
      worryMetric ? ensureMetricLoaded(worryMetric) : null,
      expMetric ? ensureMetricLoaded(expMetric) : null
    ]);
    if (myLoadToken !== loadToken) return;
    if (worryData) { sideState.worry.metric = worryMetric; sideState.worry.years = worryData.years; sideState.worry.chartData = worryData.chartData; }
    if (expData) { sideState.experience.metric = expMetric; sideState.experience.years = expData.years; sideState.experience.chartData = expData.chartData; }

    setActiveCategory(category);
    showPanelsUpTo(stage, "worry");
    showPanelsUpTo(stage, "experience");
  }
}

const scroller = scrollama();

// Preload the first metric before enabling scroll-triggered drawing
ensureMetricLoaded("Greatest_Risk").then((data) => {
  sideState.main.metric = "Greatest_Risk";
  sideState.main.years = data.years;
  sideState.main.chartData = data.chartData;

  scroller
    .setup({
      step: ".step",
      offset: 0.5,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", () => {
  scroller.resize();
  const allKeys = [
    "own", "country", "global",
    "own-worry", "country-worry", "global-worry",
    "own-experience", "country-experience", "global-experience"
  ];
  allKeys.forEach((key) => {
    const panel = document.getElementById(panelIds[key]);
    if (panel.classList.contains("visible")) {
      const side = key.includes("-worry") ? "worry" : key.includes("-experience") ? "experience" : "main";
      redrawPanel(key, side);
    }
  });
});

  categoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const category = link.dataset.category;
      const firstStepOfCategory = document.querySelector(
        `.step[data-category="${category}"]`
      );
      if (firstStepOfCategory) {
        firstStepOfCategory.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

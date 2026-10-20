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
    topN: 5,
    rankedOrder: true
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
    excludeFromRanking: [98, 99],
    topN: null
  },
  Disaster5Y: {
    labels: {
      1: "Yes",
      2: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [98, 99],
    topN: null
  },
    Climate_Change: {
    labels: {
      1: "Very serious threat",
      2: " Somewhat serious threat",
      3: " Not a threat at all ",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [98, 99],
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
    excludeFromRanking: [98, 99],
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
    excludeFromRanking: [98, 99],
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
    excludeFromRanking: [98, 99],
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
    excludeFromRanking: [98, 99],
    topN: null
  },
  Worried_Crime: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Exp2Y_Crime: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Worried_Weather: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Exp2Y_Weather: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Worried_Mental: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Exp2Y_Mental: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Worried_Work: {
    labels: {
      1: "Very worried",
      2: "Somewhat worried",
      3: "Not worried",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [98, 99],
    topN: null
  },
  Exp2Y_Work: {
    labels: {
      1: "Personally experienced",
      2: "Know someone who has experienced",
      3: "Personally and know someone",
      4: "No",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [98, 99],
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
    excludeFromRanking: [97, 98, 99],
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
    excludeFromRanking: [97, 98, 99],
    topN: null
  },
  Discirm_Reliigon: {
    labels: {
      1: "Yes",
      2: "No",
      97: "Does not apply",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [97, 98, 99],
    topN: null
  },
  Discrim_Ethnic: {
    labels: {
      1: "Yes",
      2: "No",
      97: "Does not apply",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [97, 98, 99],
    topN: null
  },
  Discrim_Disability: {
    labels: {
      1: "Yes",
      2: "No",
      97: "Does not apply",
      98: "Don't know",
      99: "Refused"
    },
    skipYears: [2019],
    excludeFromRanking: [97, 98, 99],
    topN: null
  },
  Resilience_idv: {
    labels: {
      1: "Most Resilient",
      0.75: "Very Resilient",
      0.5: "Moderately Resilient",
      0.25: "Mildly Resilient",
      0: "Least resilient"    
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null
  },
  Resilience_hhl: {
    labels: {
      1: "Most Resilient",
      0.75: "Very Resilient",
      0.5: "Moderately Resilient",
      0.25: "Mildly Resilient",
      0: "Least Resilient"      
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null,
    continuous: true
  },
  Resilience_com: {
    labels: {
      1: "Most Resilient",
      0.75: "Very Resilient",
      0.5: "Moderately Resilient",
      0.25: "Mildly Resilient",
      0: "Least Resilient"      
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null,
    continuous: true
  },
  Resilience_soc: {
    labels: {
      1: "Most Resilient",
      0.75: "Very Resilient",
      0.5: "Moderately Resilient",
      0.25: "Mildly Resilient",
      0: "Least Resilient"      
    },
    skipYears: [2019],
    excludeFromRanking: [],
    topN: null,
    continuous: true
  },
};

const ALL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Benin", "Bolivia", "Bosnia Herzegovina",
  "Botswana", "Brazil", "Bulgaria", "Burkina Faso", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Congo Brazzaville", "Costa Rica", "Croatia", "Cyprus",
  "Denmark", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Estonia", "Eswatini", "Ethiopia", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana",
  "Greece", "Guatemala", "Guinea", "Honduras", "Hong Kong", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sweden", "Switzerland", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Czech Republic", "Iceland", "Comoros", "Congo Kinshasa", "Somalia", "Oman"
];

const GLOBAL_REGIONS = {
  1: "Eastern Africa", 2: "Central/Western Africa", 3: "Northern Africa", 4: "Southern Africa", 5: "Latin America & the Caribbean",
  6: "Northern America", 7: "Central Asia", 8: "Eastern Asia", 9: "Southeastern Asia", 10: "Southern Asia",
  11: "Middle East", 12: "Eastern Europe", 13: "Northern/Western Europe", 14: "Southern Europe", 15: "Australia & New Zealand"
};

const dimensionValueLabels = {
  Gender: { "1": "Male", "2": "Female" },
  "Age Group": { "1": "15-29", "2": "30-49", "3": "50-64", "4": "65 and over" },
  Education: { "1": "Primary or less (up to 8 years)", "2": "Secondary (9-15 years)", "3": "Tertiary (16 years or more)" },
  "Income Group": { "1": "Poorest 20%", "2": "Second 20%", "3": "Middle 20%", "4": "Fourth 20%", "5": "Richest 20%" },
  Urbanicity: { "1": "Rural area or small town", "2": "Large city or suburb" }
};

const DIMENSION_NAMES = Object.keys(dimensionValueLabels);

// --- Reader-driven place/dimension selection ---
// mode: "country" -> place is a country name, up to 1 dimension (dim1)
// mode: "region"  -> place is a GLOBAL_REGIONS code (1-15), up to 2
//                    dimensions (dim1 + dim2) can be combined
const selection = {
  mode: "country",
  country: "France", // placeholder default until the dropdown is wired up
  region: 1,          // placeholder default (Eastern Africa) for region mode
  dim1: { name: "Gender", value: "2" }, // placeholder matches old sample
  dim2: { name: null, value: null }     // region mode only
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

async function loadGlobalYear(metric, year, regionCode = "Global", dimensionName = "none") {
  // Defensive: not every metric/year combination has a corresponding
  // glregion file. Treat a missing/broken file as "no data for this
  // year" rather than letting one bad fetch break the whole panel.
  try {
    const res = await fetch(`data/glregion/${metric}/${regionCode}/${year}/${dimensionName}.json`);
    if (!res.ok) return [];
    const rows = await res.json();
    // These files don't include "year" or "dimension" fields (both are
    // implied by the folder/filename), so we attach them manually here.
    return rows.map((r) => ({ ...r, year, dimension: dimensionName, dimension_value: r.dimension_1_value }));
  } catch (e) {
    return [];
  }
}

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

  let codes = ranked.map((d) => d.code);
  if (cfg.topN) codes = codes.slice(0, cfg.topN);

  if (!cfg.rankedOrder) {
    const configOrder = Object.keys(cfg.labels).map(Number);
    codes = configOrder.filter((c) => codes.includes(c));
  }

  return codes;
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

const bar = document.getElementById('controls-bar');
const chart = document.getElementById('chart-area');
const splitChart = document.getElementById('split-chart-area');
function syncChartTop() {
  const top = (58 + bar.offsetHeight + 8) + 'px';
  chart.style.top = top;
  splitChart.style.top = top;
}
syncChartTop();
window.addEventListener('resize', syncChartTop);

async function loadMetricData(metric) {
  const cfg = metricsConfig[metric];
  const isRegionMode = selection.mode === "region";

  let placeRows;
  let fileDim, otherDim; // fileDim = whichever dimension we fetch the file for; otherDim = the dimension_2 filter
  if (isRegionMode) {
    // Region mode: the export only generated each dimension PAIR once,
    // ordered by DIMENSION_NAMES. So regardless of which dropdown (dim1
    // or dim2) the reader put a dimension in, we must always fetch the
    // file for whichever one comes FIRST in that canonical order, and
    // treat the other as the dimension_2 filter - otherwise the file
    // simply won't contain that pairing.
    if (selection.dim1.name && selection.dim2.name) {
      const i1 = DIMENSION_NAMES.indexOf(selection.dim1.name);
      const i2 = DIMENSION_NAMES.indexOf(selection.dim2.name);
      if (i1 <= i2) {
        fileDim = selection.dim1;
        otherDim = selection.dim2;
      } else {
        fileDim = selection.dim2;
        otherDim = selection.dim1;
      }
    } else {
      fileDim = selection.dim1;
      otherDim = { name: null, value: null };
    }

    const regionDimFile = fileDim.name || "none";
    const rowsPerYear = await Promise.all(
      ALL_KNOWN_YEARS.map((year) => loadGlobalYear(metric, year, selection.region, regionDimFile))
    );
    placeRows = rowsPerYear.flat();
  } else {
    placeRows = await loadCountryFile(metric, selection.country);
  }

  // Drop any years this metric excludes (e.g. incompatible coding scheme)
  // before we even compute which years exist.
  let countryRows = placeRows.filter((r) => !cfg.skipYears.includes(r.year));
  if (cfg.continuous) countryRows = bucketRows(countryRows);

  const years = [...new Set(countryRows.map((r) => r.year))].sort((a, b) => a - b);

  // "own" panel: filtered to the selected dimension(s)/value(s).
  // Country mode uses dim1 only; region mode can combine dim1 + dim2,
  // matched against dimension_2/dimension_2_value in the fetched file.
  const ownRows = countryRows.filter((r) => {
    if (!isRegionMode) {
      return r.dimension === selection.dim1.name && r.dimension_value === selection.dim1.value;
    }
    const fileDimMatch = r.dimension === fileDim.name && r.dimension_value === fileDim.value;
    if (!otherDim.name) return fileDimMatch && r.dimension_2 === "none" && r.dimension_2_value === "none";
    return fileDimMatch && r.dimension_2 === otherDim.name && r.dimension_2_value === otherDim.value;
  });

  // "country"/"place average" panel: no dimensions at all (dimension ===
  // "none" in both country and region mode - region files use "none.json"
  // for this, fetched separately below since dim1 might differ).
  const countryAvgRowsPerYear = isRegionMode
    ? await Promise.all(years.map((year) => loadGlobalYear(metric, year, selection.region, "none")))
    : null;
  const countryAvgRows = isRegionMode
    ? countryAvgRowsPerYear.flat().filter((r) => !cfg.skipYears.includes(r.year))
    : countryRows.filter((r) => r.dimension === "none" && r.dimension_value === "none");

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

function describeSelection() {
  const place = selection.mode === "country" ? selection.country : GLOBAL_REGIONS[selection.region];

  const dims = [];
  if (selection.dim1.name && selection.dim1.value) {
    dims.push(`${selection.dim1.name} = ${dimensionValueLabels[selection.dim1.name][selection.dim1.value]}`);
  }
  if (selection.mode === "region" && selection.dim2.name && selection.dim2.value) {
    dims.push(`${selection.dim2.name} = ${dimensionValueLabels[selection.dim2.name][selection.dim2.value]}`);
  }

  return { place, dimText: dims.join(", ") };
}

function updatePanelLabels(side) {
  const suffix = side === "main" ? "" : `-${side}`;
  const { place, dimText } = describeSelection();

  const ownEl = document.getElementById(`panel-label-own${suffix}`);
  const countryEl = document.getElementById(`panel-label-country${suffix}`);

  if (ownEl) ownEl.textContent = `Your selection: ${place}${dimText ? ", " + dimText : ""}`;
  if (countryEl) {
    countryEl.textContent = selection.mode === "country"
      ? `Country average: ${place}`
      : `Region average: ${place}`;
  }
}

const sharedLegendKeys = { main: "main-shared", worry: "worry-shared", experience: "experience-shared" };

function applyLegendMode(side, metric) {
  const suffix = side === "main" ? "" : `-${side}`;
  const panelKeys = ["own", "country", "global"].map((k) => k + suffix);
  const isGreatestRisk = metric === "Greatest_Risk";

  // Per-panel legends: hidden whenever we're using the shared legend instead.
  panelKeys.forEach((key) => {
    const el = document.querySelector(`.panel-legend[data-legend="${key}"]`);
    if (el) el.classList.toggle("panel-legend-hidden", !isGreatestRisk);
  });

  // Shared legend: shown + populated whenever all 3 panels use the same
  // fixed category list (i.e. everything except Greatest_Risk).
  const sharedEl = document.querySelector(`.panel-legend[data-legend="${sharedLegendKeys[side]}"]`);
  if (!sharedEl) return;
  sharedEl.classList.toggle("visible", !isGreatestRisk);
  if (!isGreatestRisk) {
    // All 3 panels share identical categories for these metrics, so any
    // one panel's series (country panel is always populated) gives us
    // the full label set.
    const seriesData = sideState[side].chartData.country || [];
    renderLegend(sharedLegendKeys[side], seriesData);
  }
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
    // Category-intro steps have a title but no metric - still swap the
    // title for them, just skip the chart-loading logic that follows.
    const titleKey = metric || `intro:${title}`;
    if (titleKey !== currentDisplayKey) {
      playTitleSwap();
      currentDisplayKey = titleKey;
    }
    if (metric && currentDisplayKey === metric) {
      const myLoadToken = ++loadToken;
      const data = await ensureMetricLoaded(metric);
      if (myLoadToken !== loadToken) return;
      sideState.main.metric = metric;
      sideState.main.years = data.years;
      sideState.main.chartData = data.chartData;
      applyLegendMode("main", metric);
      updatePanelLabels("main");
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
    if (worryData) { sideState.worry.metric = worryMetric; sideState.worry.years = worryData.years; sideState.worry.chartData = worryData.chartData; applyLegendMode("worry", worryMetric); updatePanelLabels("main"); }
    if (expData) { sideState.experience.metric = expMetric; sideState.experience.years = expData.years; sideState.experience.chartData = expData.chartData; applyLegendMode("experience", expMetric); updatePanelLabels("main"); }

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

// --- Controls bar: populate dropdowns + wire interactions ---

const modeButtons = document.querySelectorAll(".mode-btn");
const placeSelect = document.getElementById("place-select");
const placeSelectLabel = document.getElementById("place-select-label");
const dim1Select = document.getElementById("dimension1-select");
const dim1ValueSelect = document.getElementById("dimension1-value-select");
const dim2Group = document.getElementById("dimension2-group");
const dim2Select = document.getElementById("dimension2-select");
const dim2ValueSelect = document.getElementById("dimension2-value-select");

function populateSelect(selectEl, optionsMap, { includeNone = false, noneLabel = "None" } = {}) {
  selectEl.innerHTML = "";
  if (includeNone) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = noneLabel;
    selectEl.appendChild(opt);
  }
  Object.entries(optionsMap).forEach(([value, label]) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    selectEl.appendChild(opt);
  });
}

function populatePlaceSelect() {
  if (selection.mode === "country") {
    placeSelectLabel.textContent = "Country";
    const asMap = Object.fromEntries(ALL_COUNTRIES.map((c) => [c, c]));
    populateSelect(placeSelect, asMap);
    placeSelect.value = selection.country;
  } else {
    placeSelectLabel.textContent = "Global region";
    populateSelect(placeSelect, GLOBAL_REGIONS);
    placeSelect.value = String(selection.region);
  }
}

function populateDimensionValueSelect(valueSelectEl, dimensionName, currentValue) {
  if (!dimensionName) {
    valueSelectEl.innerHTML = "";
    valueSelectEl.disabled = true;
    return;
  }
  valueSelectEl.disabled = false;
  populateSelect(valueSelectEl, dimensionValueLabels[dimensionName]);
  if (currentValue) valueSelectEl.value = currentValue;
}

function populateDimensionControls() {
  const dimNameMap = Object.fromEntries(DIMENSION_NAMES.map((d) => [d, d]));

  // Dimension 1 is required in both modes (country-average/region-average
  // panels already cover the "no dimension" case), so no "None" option here.
  const dim1Options = selection.mode === "region" && selection.dim2.name
    ? Object.fromEntries(DIMENSION_NAMES.filter((d) => d !== selection.dim2.name).map((d) => [d, d]))
    : dimNameMap;
  populateSelect(dim1Select, dim1Options);
  if (!selection.dim1.name || !dim1Options[selection.dim1.name]) {
    selection.dim1.name = Object.keys(dim1Options)[0];
  }
  dim1Select.value = selection.dim1.name;
  populateDimensionValueSelect(dim1ValueSelect, selection.dim1.name, selection.dim1.value);
  if (!selection.dim1.value) {
    selection.dim1.value = dim1ValueSelect.value || null;
  }

  dim2Group.classList.toggle("hidden", selection.mode !== "region");
  if (selection.mode === "region") {
    // Dimension 2 keeps "None" (user may want just one dimension), but
    // excludes whatever is currently chosen as Dimension 1.
    const dim2Options = Object.fromEntries(
      DIMENSION_NAMES.filter((d) => d !== selection.dim1.name).map((d) => [d, d])
    );
    populateSelect(dim2Select, dim2Options, { includeNone: true });
    dim2Select.value = selection.dim2.name || "";
    populateDimensionValueSelect(dim2ValueSelect, selection.dim2.name, selection.dim2.value);
  }
}

function readDimensionFromControls(nameSelect, valueSelect) {
  const name = nameSelect.value || null;
  const value = name ? (valueSelect.value || null) : null;
  return { name, value };
}

async function refreshCurrentStep() {
  const myLoadToken = ++loadToken;
  delete dataCache[currentDisplayKey]; // old cache key is now stale for this selection
  Object.keys(dataCache).forEach((k) => delete dataCache[k]); // selection changed: whole cache is stale

  const activeStep = document.querySelector(".step.is-active") || document.querySelector(".step");
  // Re-run whichever side(s) are currently on screen by re-invoking the
  // same logic handleStepEnter uses, keyed off scrollama's last-known step.
  if (currentDisplayKey && currentDisplayKey.includes("|")) {
    const [worryMetric, expMetric] = currentDisplayKey.split("|");
    const [worryData, expData] = await Promise.all([
      worryMetric ? loadMetricData(worryMetric) : null,
      expMetric ? loadMetricData(expMetric) : null
    ]);
    if (myLoadToken !== loadToken) return;
    const [worryMetricName, expMetricName] = currentDisplayKey.split("|");
    if (worryData) { sideState.worry.years = worryData.years; sideState.worry.chartData = worryData.chartData; applyLegendMode("worry", worryMetricName); updatePanelLabels("worry"); }
    if (expData) { sideState.experience.years = expData.years; sideState.experience.chartData = expData.chartData; applyLegendMode("experience", expMetricName); updatePanelLabels("experience"); }
    ["own-worry", "country-worry", "global-worry", "own-experience", "country-experience", "global-experience"].forEach((key) => {
      const side = key.includes("-worry") ? "worry" : "experience";
      const panel = document.getElementById(panelIds[key]);
      if (panel.classList.contains("visible")) redrawPanel(key, side);
    });
  } else if (currentDisplayKey) {
    const data = await loadMetricData(currentDisplayKey);
    if (myLoadToken !== loadToken) return;
    sideState.main.years = data.years;
    sideState.main.chartData = data.chartData;
    applyLegendMode("main", currentDisplayKey);
    updatePanelLabels("main");
    ["own", "country", "global"].forEach((key) => {
      const panel = document.getElementById(panelIds[key]);
      if (panel.classList.contains("visible")) redrawPanel(key, "main");
    });
  }
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selection.mode = btn.dataset.mode;
    populatePlaceSelect();
    populateDimensionControls();
    refreshCurrentStep();
  });
});

placeSelect.addEventListener("change", () => {
  if (selection.mode === "country") {
    selection.country = placeSelect.value;
  } else {
    selection.region = Number(placeSelect.value);
  }
  refreshCurrentStep();
});

dim1Select.addEventListener("change", () => {
  selection.dim1 = readDimensionFromControls(dim1Select, dim1ValueSelect);
  populateDimensionValueSelect(dim1ValueSelect, selection.dim1.name, null);
  selection.dim1.value = dim1ValueSelect.value || null;
  // If dim2 was set to the same dimension we just picked for dim1, clear it.
  if (selection.dim2.name === selection.dim1.name) {
    selection.dim2 = { name: null, value: null };
  }
  populateDimensionControls(); // refresh dim2's excluded-options list
  refreshCurrentStep();
});

dim1ValueSelect.addEventListener("change", () => {
  selection.dim1.value = dim1ValueSelect.value || null;
  refreshCurrentStep();
});

dim2Select.addEventListener("change", () => {
  selection.dim2 = readDimensionFromControls(dim2Select, dim2ValueSelect);
  populateDimensionValueSelect(dim2ValueSelect, selection.dim2.name, null);
  selection.dim2.value = dim2ValueSelect.value || null;
  populateDimensionControls(); // refresh dim1's excluded-options list
  refreshCurrentStep();
});

dim2ValueSelect.addEventListener("change", () => {
  selection.dim2.value = dim2ValueSelect.value || null;
  refreshCurrentStep();
});

populatePlaceSelect();
populateDimensionControls();
updatePanelLabels("main");

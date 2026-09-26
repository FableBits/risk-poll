// --- Config for current test: metric, place, and selected dimension ---
const currentMetric = "More_Safe";
const currentCountry = "France";
const currentDimension = "Gender";
const currentDimensionValue = "2"; // stored as a numeric-looking string in the data

const dimensionValueLabels = {
  Gender: {
    "1": "Male",
    "2": "Female"
  }
};

const metricLabels = {
  More_Safe: {
    1: "More safe",
    2: "Less safe",
    3: "About as safe",
    98: "Don't know",
    99: "Refused"
  }
};

const colors = {
  "More safe": "#ff5db1",
  "Less safe": "#3ddc97",
  "About as safe": "#ffd23f",
  "Don't know": "#7aa2f7",
  "Refused": "#c084fc"
};

let years = [];
let chartData = { own: [], country: [], global: [] };

// --- Data loading ---

async function loadCountryFile(metric, country) {
  const res = await fetch(`data/country/${metric}/${country}.json`);
  return res.json();
}

async function loadGlobalYear(metric, year) {
  // Defensive: not every metric/year combination has a corresponding
  // glregion file (e.g. some metrics are missing from certain years).
  // If the file is missing or fails to parse, treat it as "no data for
  // this year" rather than letting one bad fetch break the whole panel.
  try {
    const res = await fetch(`data/glregion/${metric}/Global/${year}/none.json`);
    if (!res.ok) return [];
    const rows = await res.json();
    // These files don't include a "year" field (it's implied by the folder),
    // so we attach it manually here.
    return rows.map((r) => ({ ...r, year }));
  } catch (e) {
    return [];
  }
}

function labelFor(metric, code) {
  return metricLabels[metric][code] || String(code);
}

function buildSeries(rows, labelKeys) {
  const byLabel = {};
  labelKeys.forEach((code) => {
    byLabel[labelFor(currentMetric, code)] = new Array(years.length).fill(null);
  });

  rows.forEach((row) => {
    const label = labelFor(currentMetric, row.value_label);
    const yearIndex = years.indexOf(row.year);
    if (yearIndex !== -1 && byLabel[label] !== undefined) {
      byLabel[label][yearIndex] = Math.round(row.pct * 100) / 100;
    }
  });

  return Object.entries(byLabel).map(([label, values]) => ({ label, values }));
}

async function loadAllData() {
  const countryRows = await loadCountryFile(currentMetric, currentCountry);

  // Determine the full set of years present, sorted ascending
  years = [...new Set(countryRows.map((r) => r.year))].sort((a, b) => a - b);

  const labelKeys = Object.keys(metricLabels[currentMetric]).map(Number);

  // "own" panel: filtered to the selected dimension/value
  const ownRows = countryRows.filter(
    (r) => r.dimension === currentDimension && r.dimension_value === currentDimensionValue
  );
  chartData.own = buildSeries(ownRows, labelKeys);

  // "country" panel: dimension === "none" (overall country average)
  const countryAvgRows = countryRows.filter(
    (r) => r.dimension === "none" && r.dimension_value === "none"
  );
  chartData.country = buildSeries(countryAvgRows, labelKeys);

  // "global" panel: one glregion fetch per year, dimension_1/2 === "none"
  const globalRowsPerYear = await Promise.all(
    years.map((year) => loadGlobalYear(currentMetric, year))
  );
  const globalRows = globalRowsPerYear.flat().filter(
    (r) => r.dimension_2 === "none" && r.dimension_2_value === "none"
  );
  chartData.global = buildSeries(globalRows, labelKeys);
}

// --- D3 chart drawing ---

function drawChart(svgSelector, seriesData) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove();

  const node = svg.node();
  const width = node.clientWidth || 300;
  const height = node.clientHeight || 100;
  const margin = { top: 10, right: 10, bottom: 20, left: 30 };

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scalePoint()
    .domain(years)
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .defined((d) => d !== null)
    .x((d, i) => x(years[i]))
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
      .attr("stroke", colors[series.label] || "#fff")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    svg.selectAll(`.dot-${series.label.replace(/\W/g, "")}`)
      .data(series.values)
      .enter()
      .filter((d) => d !== null)
      .append("circle")
      .attr("cx", (d, i) => x(years[i]))
      .attr("cy", (d) => y(d))
      .attr("r", 3)
      .attr("fill", colors[series.label] || "#fff");
  });
}

const panelIds = {
  own: "panel-own",
  country: "panel-country",
  global: "panel-global"
};

function redrawPanel(key) {
  drawChart(`svg[data-series="${key}"]`, chartData[key]);
}

// --- Crossfade logic:
// 1. Fade OUT every panel (opacity -> 0), wait for the fade to finish.
// 2. While invisible, instantly resize panels to the new stage AND
//    redraw their chart content at the new size (no visible deformation,
//    since nothing is visible at this moment).
// 3. Fade IN the panels that should be visible at this stage.
let transitionToken = 0;

function showPanelsUpTo(stage) {
  const myToken = ++transitionToken; // guards against overlapping transitions
  const allKeys = ["own", "country", "global"];
  const allPanels = allKeys.map((k) => document.getElementById(panelIds[k]));

  // Step 1: fade everything out
  allPanels.forEach((p) => p.classList.remove("shown"));

  setTimeout(() => {
    if (myToken !== transitionToken) return; // a newer transition took over

    // Step 2: resize instantly (invisible) + redraw at final size
    allKeys.forEach((key, i) => {
      const shouldBeVisible = (i + 1) <= stage;
      const panel = allPanels[i];
      panel.classList.toggle("visible", shouldBeVisible);
    });

    // Let layout settle one frame before measuring/drawing
    requestAnimationFrame(() => {
      if (myToken !== transitionToken) return;
      allKeys.forEach((key, i) => {
        if ((i + 1) <= stage) redrawPanel(key);
      });

      // Step 3: fade the correct panels back in
      requestAnimationFrame(() => {
        if (myToken !== transitionToken) return;
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

function handleStepEnter(response) {
  const stepEl = response.element;
  const title = stepEl.dataset.title;
  const category = stepEl.dataset.category;
  const type = stepEl.dataset.type;

  titleEl.textContent = title;
  setActiveCategory(category);

  if (type === "reveal-1") showPanelsUpTo(1);
  if (type === "reveal-2") showPanelsUpTo(2);
  if (type === "reveal-3") showPanelsUpTo(3);
  if (type === "category-intro") showPanelsUpTo(0);
}

const scroller = scrollama();

// Wait for data to load before enabling scroll-triggered drawing
loadAllData().then(() => {
  scroller
    .setup({
      step: ".step",
      offset: 0.5,
      debug: false
    })
    .onStepEnter(handleStepEnter);

  window.addEventListener("resize", () => {
    scroller.resize();
    ["own", "country", "global"].forEach((key) => {
      const panel = document.getElementById(panelIds[key]);
      if (panel.classList.contains("visible")) redrawPanel(key);
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

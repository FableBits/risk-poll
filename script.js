// --- D3 chart test: proving charts appear "in place" inside a
// sticky box, with panels resizing (not sliding) to make room. ---

// Fake data: 4 fake years, 3 answer lines, for 3 levels
// (own selection, country average, global average).
const years = [2018, 2019, 2021, 2023];

const fakeData = {
  own: [
    { label: "Yes", values: [40, 45, 50, 58] },
    { label: "No", values: [45, 40, 35, 30] },
    { label: "Don't know", values: [15, 15, 15, 12] }
  ],
  country: [
    { label: "Yes", values: [38, 40, 42, 46] },
    { label: "No", values: [48, 46, 45, 42] },
    { label: "Don't know", values: [14, 14, 13, 12] }
  ],
  global: [
    { label: "Yes", values: [35, 36, 38, 40] },
    { label: "No", values: [50, 49, 47, 46] },
    { label: "Don't know", values: [15, 15, 15, 14] }
  ]
};

const colors = {
  "Yes": "#ff5db1",
  "No": "#3ddc97",
  "Don't know": "#ffd23f"
};

function drawChart(svgSelector, seriesData) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove(); // clear before redraw (safe on resize)

  const node = svg.node();
  const width = node.clientWidth || 300;
  const height = node.clientHeight || 100;
  const margin = { top: 10, right: 10, bottom: 20, left: 30 };

  svg.attr("viewBox", `0 0 ${width} ${height}`);

  const x = d3.scalePoint()
    .domain(years)
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
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
      .attr("stroke", colors[series.label])
      .attr("stroke-width", 2.5)
      .attr("d", line);

    svg.selectAll(`.dot-${series.label.replace(/\W/g, "")}`)
      .data(series.values)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => x(years[i]))
      .attr("cy", (d) => y(d))
      .attr("r", 3)
      .attr("fill", colors[series.label]);
  });
}

function redrawAllVisiblePanels() {
  // Redraw whichever panels are currently visible, sized to their
  // NEW dimensions (important since flex-grow just changed their height).
  if (document.getElementById("panel-own").classList.contains("visible")) {
    drawChart('svg[data-series="own"]', fakeData.own);
  }
  if (document.getElementById("panel-country").classList.contains("visible")) {
    drawChart('svg[data-series="country"]', fakeData.country);
  }
  if (document.getElementById("panel-global").classList.contains("visible")) {
    drawChart('svg[data-series="global"]', fakeData.global);
  }
}

// --- Scrollama wiring ---
const titleEl = document.getElementById("question-title");
const categoryLinks = document.querySelectorAll(".category-link");

function setActiveCategory(category) {
  categoryLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.category === category);
  });
}

function showPanelsUpTo(stage) {
  // stage: 1, 2, or 3 -> show that many panels, hide the rest
  document.getElementById("panel-own").classList.toggle("visible", stage >= 1);
  document.getElementById("panel-country").classList.toggle("visible", stage >= 2);
  document.getElementById("panel-global").classList.toggle("visible", stage >= 3);

  // Wait for the CSS flex-grow transition to finish before redrawing,
  // so the D3 chart draws at its FINAL size, not its mid-transition size.
  setTimeout(redrawAllVisiblePanels, 620);
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

scroller
  .setup({
    step: ".step",
    offset: 0.5,
    debug: false
  })
  .onStepEnter(handleStepEnter);

window.addEventListener("resize", () => {
  scroller.resize();
  redrawAllVisiblePanels();
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

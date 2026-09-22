// --- D3 chart test: crossfade transitions, no resize distortion ---

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

const panelIds = {
  own: "panel-own",
  country: "panel-country",
  global: "panel-global"
};

function redrawPanel(key) {
  drawChart(`svg[data-series="${key}"]`, fakeData[key]);
}

// Crossfade logic:
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

// --- Proof-of-concept scrollama wiring ---
// Goal: prove that scrolling correctly triggers step-detection,
// and that we can react to it by updating the title, a debug
// message, and the active category highlight. No real charts yet.

const titleEl = document.getElementById("question-title");
const debugEl = document.getElementById("debug-info");
const categoryLinks = document.querySelectorAll(".category-link");

function setActiveCategory(category) {
  categoryLinks.forEach((link) => {
    if (link.dataset.category === category) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function handleStepEnter(response) {
  const stepEl = response.element;
  const title = stepEl.dataset.title;
  const category = stepEl.dataset.category;
  const type = stepEl.dataset.type;

  titleEl.textContent = title;
  debugEl.textContent = `Active step type: ${type} | category: ${category} | direction: ${response.direction}`;
  setActiveCategory(category);
}

// Initialize scrollama
const scroller = scrollama();

scroller
  .setup({
    step: ".step",       // every element with class "step" is a scrollama step
    offset: 0.5,         // step is considered "active" when it crosses the middle of the viewport
    debug: false         // set to true temporarily if you want scrollama's own visual debug markers
  })
  .onStepEnter(handleStepEnter);

// Keep scrollama's measurements correct if the window is resized
// (e.g., rotating a phone from portrait to landscape)
window.addEventListener("resize", () => {
  scroller.resize();
});

// Basic click-to-jump behavior for the category nav
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

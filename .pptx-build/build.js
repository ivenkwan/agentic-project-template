// The Evolution of AI Agents — dark tech deck, 10 slides
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const FA = require("react-icons/fa");

// ---------- palette ----------
const BG = "0B0F1A", CARD = "121A2C", CARD_LINE = "232E4A", EDGE = "1E2A45";
const TXT = "EAF2FB", MUT = "8CA0BC", FNT = "5C6E8C";
const C = { s1: "33D6E8", s2: "9F8CFF", s3: "35E0A1" };          // cyan / violet / emerald
const DIMF = { s1: "102832", s2: "221F3F", s3: "0F2B21" };         // icon-circle fills
const DIML = { s1: "1E4A5A", s2: "3D3867", s3: "1C5A46" };         // dim borders
const TINT = { s1: "0F2530", s2: "1C1B36", s3: "0F2E26" };         // banner fills
const MONO = "Courier New", SANS = "Arial";
const PW = 10, PH = 5.625;

const P = new pptxgen();
P.layout = "LAYOUT_16x9";
P.author = "ZCode";
P.title = "The Evolution of AI Agents";

// ---------- icons ----------
const ICONS = {
  listol: ["FaListOl", "s1"], link: ["FaLink", "s1"], user: ["FaUserCircle", "s1"],
  random: ["FaRandom", "s1"], history: ["FaHistory", "s1"], compress: ["FaCompressArrowsAlt", "s1"],
  warn: ["FaExclamationTriangle", "s1"], ban: ["FaBan", "s1"], terminal: ["FaTerminal", "s1"],
  layer: ["FaLayerGroup", "s2"], bolt: ["FaBolt", "s2"], brain: ["FaBrain", "s2"],
  db: ["FaDatabase", "s2"], tools: ["FaTools", "s2"],
  sync: ["FaSyncAlt", "s3"], plug: ["FaPlug", "s3"], shield: ["FaShieldAlt", "s3"], vial: ["FaVial", "s3"],
  rocket: ["FaRocket", "s3"], search: ["FaSearchPlus", "s3"], exch: ["FaExchangeAlt", "s3"],
  server: ["FaServer", "s3"], feather: ["FaFeatherAlt", "s3"], bulb: ["FaLightbulb", "s3"],
  diagram: ["FaProjectDiagram", "s3"],
};
const ICON_DATA = {};
async function rasterizeIcons() {
  for (const [key, [name, stage]] of Object.entries(ICONS)) {
    const svg = ReactDOMServer.renderToStaticMarkup(
      React.createElement(FA[name], { color: "#" + C[stage], size: "256" })
    );
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    ICON_DATA[key] = "image/png;base64," + png.toString("base64");
  }
}

// ---------- helpers ----------
function bg(s) { s.background = { color: BG }; }

function rail(s, active, page) {
  const cols = [C.s1, C.s2, C.s3];
  s.addShape(P.shapes.LINE, { x: 0.5, y: 5.325, w: 0.44, h: 0, line: { color: EDGE, width: 1 } });
  for (let i = 0; i < 3; i++) {
    const on = active === "all" || active === i;
    const d = on ? 0.11 : 0.075;
    const cx = 0.5 + i * 0.22;
    s.addShape(P.shapes.OVAL, { x: cx - d / 2, y: 5.325 - d / 2, w: d, h: d, fill: { color: on ? cols[i] : "26314D" } });
  }
  if (active !== "all")
    s.addText(["01 · PROMPT", "02 · CONTEXT", "03 · HARNESS"][active], {
      x: 1.15, y: 5.23, w: 2.2, h: 0.18, fontFace: MONO, fontSize: 8, color: cols[active], charSpacing: 1.5, margin: 0,
    });
  s.addText(page, { x: 8.9, y: 5.23, w: 0.6, h: 0.18, fontFace: MONO, fontSize: 8, color: FNT, align: "right", margin: 0 });
}

function kicker(s, txt, color) {
  s.addShape(P.shapes.OVAL, { x: 0.5, y: 0.37, w: 0.09, h: 0.09, fill: { color } });
  s.addText(txt, { x: 0.68, y: 0.31, w: 8.6, h: 0.2, fontFace: MONO, fontSize: 10, color, charSpacing: 2.5, margin: 0 });
}

function title(s, txt, y = 0.58, size = 30, w = 9) {
  s.addText(txt, { x: 0.5, y, w, h: 0.55, fontFace: SANS, fontSize: size, bold: true, color: TXT, margin: 0 });
}

function iconChip(s, key, cx, cy, d, stage) {
  s.addShape(P.shapes.OVAL, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: DIMF[stage] } });
  const iw = d * 0.52;
  s.addImage({ data: ICON_DATA[key], x: cx - iw / 2, y: cy - iw / 2, w: iw, h: iw });
}

function card(s, x, y, w, h, fill = CARD, line = CARD_LINE) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: line, width: 0.75 }, rectRadius: 0.07 });
}

function arrow(s, x, y, w, h, color, flipV = false) {
  s.addShape(P.shapes.LINE, { x, y, w, h, flipV, line: { color, width: 1.25, endArrowType: "triangle" } });
}

// decorative node graph: pts = [x, y, d, hex, transparency]
function nodeGraph(s, pts, edges) {
  edges.forEach(([a, b]) => {
    s.addShape(P.shapes.LINE, {
      x: Math.min(pts[a][0], pts[b][0]), y: Math.min(pts[a][1], pts[b][1]),
      w: Math.abs(pts[a][0] - pts[b][0]) || 0.001, h: Math.abs(pts[a][1] - pts[b][1]) || 0.001,
      flipV: (pts[b][0] - pts[a][0]) * (pts[b][1] - pts[a][1]) < 0,
      line: { color: EDGE, width: 0.75 },
    });
  });
  pts.forEach(([x, y, d, col, tr]) => {
    s.addShape(P.shapes.OVAL, { x: x - d / 2, y: y - d / 2, w: d, h: d, fill: { color: col, transparency: tr } });
  });
}

// glow node for timeline axes
function glowNode(s, cx, cy, color) {
  s.addShape(P.shapes.OVAL, { x: cx - 0.2, y: cy - 0.2, w: 0.4, h: 0.4, fill: { color, transparency: 84 } });
  s.addShape(P.shapes.OVAL, { x: cx - 0.11, y: cy - 0.11, w: 0.22, h: 0.22, fill: { color: BG }, line: { color, width: 1.5 } });
  s.addShape(P.shapes.OVAL, { x: cx - 0.05, y: cy - 0.05, w: 0.1, h: 0.1, fill: { color } });
}

// ---------- deck ----------
async function build() {
  await rasterizeIcons();

  // ============ S1 · TITLE ============
  {
    const s = P.addSlide();
    bg(s);
    nodeGraph(s, // top-right cluster
      [[7.1, 0.55, 0.05, C.s1, 55], [8.0, 0.32, 0.07, C.s2, 60], [8.85, 0.72, 0.05, C.s3, 60],
       [9.5, 0.28, 0.05, C.s1, 70], [8.25, 1.18, 0.06, C.s1, 65], [9.3, 1.42, 0.08, C.s2, 55],
       [7.55, 1.5, 0.05, C.s3, 70], [9.62, 0.95, 0.04, C.s3, 70]],
      [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [2, 5], [4, 6], [0, 6], [5, 7]]);
    nodeGraph(s, // bottom-left cluster
      [[0.38, 4.5, 0.05, C.s2, 60], [1.15, 4.82, 0.07, C.s1, 55], [0.85, 5.25, 0.05, C.s3, 65],
       [1.85, 5.18, 0.06, C.s1, 65], [2.55, 4.78, 0.08, C.s2, 55], [2.0, 4.45, 0.04, C.s3, 70]],
      [[0, 1], [1, 2], [1, 3], [3, 4], [0, 5], [5, 3]]);

    s.addShape(P.shapes.OVAL, { x: 0.5, y: 0.62, w: 0.09, h: 0.09, fill: { color: C.s1 } });
    s.addText("AGENT ENGINEERING // A FIELD BRIEFING", {
      x: 0.68, y: 0.56, w: 8, h: 0.2, fontFace: MONO, fontSize: 10.5, color: C.s1, charSpacing: 3, margin: 0,
    });
    s.addText("The Evolution of", { x: 0.5, y: 1.28, w: 9, h: 0.72, fontFace: SANS, fontSize: 40, bold: true, color: TXT, margin: 0 });
    s.addText("AI Agents", { x: 0.5, y: 1.98, w: 9, h: 0.75, fontFace: SANS, fontSize: 40, bold: true, color: C.s1, margin: 0 });
    s.addText(
      "How agent design moved from crafting prompts, to engineering context, to building the harness — and why each shift became inevitable.",
      { x: 0.5, y: 2.95, w: 6.6, h: 0.65, fontFace: SANS, fontSize: 13.5, color: MUT, margin: 0 }
    );

    // timeline teaser rail
    s.addShape(P.shapes.LINE, { x: 0.6, y: 4.62, w: 8.8, h: 0, line: { color: "2A3550", width: 1 } });
    s.addShape(P.shapes.LINE, { x: 0.6, y: 4.62, w: 2.9, h: 0, line: { color: C.s1, width: 2 } });
    s.addShape(P.shapes.LINE, { x: 3.53, y: 4.62, w: 2.87, h: 0, line: { color: C.s2, width: 2 } });
    s.addShape(P.shapes.LINE, { x: 6.43, y: 4.62, w: 2.97, h: 0, line: { color: C.s3, width: 2 } });
    const stages = [
      { cx: 1.7, col: C.s1, n: "01 · PROMPT ENGINEERING", y: "2020 – 2023" },
      { cx: 5.0, col: C.s2, n: "02 · CONTEXT ENGINEERING", y: "2023 – 2025" },
      { cx: 8.3, col: C.s3, n: "03 · HARNESS ENGINEERING", y: "2025 →" },
    ];
    stages.forEach(({ cx, col, n, y }) => {
      glowNode(s, cx, 4.62, col);
      s.addText(n, { x: cx - 1.4, y: 4.92, w: 2.8, h: 0.2, align: "center", fontFace: MONO, fontSize: 9, color: col, margin: 0 });
      s.addText(y, { x: cx - 1.4, y: 5.14, w: 2.8, h: 0.18, align: "center", fontFace: MONO, fontSize: 8, color: FNT, margin: 0 });
    });
    s.addNotes("Frame the talk: three engineering paradigms, each triggered by the failures of the one before. The rail at the bottom is the map for the whole deck.");
  }

  // ============ S2 · TIMELINE OVERVIEW ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "// THE TIMELINE", C.s1);
    title(s, "Three Paradigm Shifts");
    nodeGraph(s,
      [[8.6, 0.35, 0.05, C.s1, 65], [9.3, 0.62, 0.07, C.s3, 65], [8.95, 1.05, 0.04, C.s2, 70], [9.55, 1.1, 0.05, C.s1, 70]],
      [[0, 1], [1, 2], [1, 3]]);

    const AY = 3.02;
    s.addShape(P.shapes.LINE, { x: 0.7, y: AY, w: 8.6, h: 0, line: { color: "232E4A", width: 1.25 } });
    s.addShape(P.shapes.LINE, { x: 0.7, y: AY, w: 2.8, h: 0, line: { color: C.s1, width: 2.25 } });
    s.addShape(P.shapes.LINE, { x: 3.53, y: AY, w: 2.81, h: 0, line: { color: C.s2, width: 2.25 } });
    s.addShape(P.shapes.LINE, { x: 6.37, y: AY, w: 2.93, h: 0, line: { color: C.s3, width: 2.25 } });

    const cols = [
      {
        cx: 2.13, col: C.s1, phase: "PHASE 01 — 2020–2023", name: "Prompt Engineering",
        tag: "Crafting the perfect ask. The model as a text interface — patterns, not programs.",
        ms: [["2020", "GPT-3 proves few-shot prompting"], ["2022", "ChatGPT makes prompting mainstream"]],
      },
      {
        cx: 5.0, col: C.s2, phase: "PHASE 02 — 2023–2025", name: "Context Engineering",
        tag: "Curating what the model sees. Retrieval, memory, and tools feed the window.",
        ms: [["2023", "Function calling lands in APIs"], ["2024", "MCP standardizes tool access"]],
      },
      {
        cx: 7.87, col: C.s3, phase: "PHASE 03 — 2025 →", name: "Harness Engineering",
        tag: "Engineering everything around the model. Loops, guardrails, runtimes, evals.",
        ms: [["2023", "AutoGPT previews the agent loop"], ["2025", "Agentic CLIs & agent gateways"]],
      },
    ];
    cols.forEach(({ cx, col, phase, name, tag, ms }) => {
      glowNode(s, cx, AY, col);
      s.addText(phase, { x: cx - 1.4, y: 1.12, w: 2.8, h: 0.18, align: "center", fontFace: MONO, fontSize: 9.5, color: col, charSpacing: 1, margin: 0 });
      s.addText(name, { x: cx - 1.4, y: 1.34, w: 2.8, h: 0.36, align: "center", fontFace: SANS, fontSize: 18.5, bold: true, color: TXT, margin: 0 });
      s.addText(tag, { x: cx - 1.4, y: 1.78, w: 2.8, h: 0.95, align: "center", valign: "top", fontFace: SANS, fontSize: 10.5, color: MUT, margin: 0 });
      ms.forEach(([yr, txt], i) => {
        const y = 3.38 + i * 0.58;
        s.addShape(P.shapes.OVAL, { x: cx - 1.4, y: y + 0.05, w: 0.06, h: 0.06, fill: { color: col } });
        s.addText(yr, { x: cx - 1.26, y, w: 0.72, h: 0.18, fontFace: MONO, fontSize: 9, bold: true, color: col, margin: 0 });
        s.addText(txt, { x: cx - 0.52, y: y - 0.015, w: 1.92, h: 0.52, valign: "top", fontFace: SANS, fontSize: 9.5, color: MUT, margin: 0 });
      });
    });
    rail(s, "all", "02 / 10");
    s.addNotes("The map slide. Each phase is a response to the previous phase's wall: prompts hit statelessness, context hit integration complexity, harnesses absorb both.");
  }

  // ============ S3 · STAGE 1 — ORIGINS & TECHNIQUES ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 01 // 2020–2023 · PROMPT ENGINEERING", C.s1);
    title(s, "The Art of Asking");

    card(s, 0.5, 1.32, 3.0, 3.75);
    s.addText("ORIGINS", { x: 0.75, y: 1.52, w: 2.5, h: 0.2, fontFace: MONO, fontSize: 9.5, color: C.s1, charSpacing: 2, margin: 0 });
    const origins = [
      ["2020", "GPT-3 shows few-shot learning — examples replace fine-tuning."],
      ["2022", "ChatGPT + RLHF make instruction-following mainstream."],
      ["IDEA", "The prompt is the program: language as the interface."],
    ];
    origins.forEach(([yr, txt], i) => {
      const y = 1.88 + i * 1.0;
      s.addText(yr, { x: 0.75, y, w: 0.62, h: 0.2, fontFace: MONO, fontSize: 10.5, bold: true, color: C.s1, margin: 0 });
      s.addText(txt, { x: 1.44, y: y - 0.03, w: 1.92, h: 0.92, valign: "top", fontFace: SANS, fontSize: 10, color: MUT, margin: 0 });
    });

    const tech = [
      ["listol", "Few-shot examples", "Drop 3–5 worked examples into the prompt; the model pattern-matches the task."],
      ["link", "Chain-of-thought", "“Think step by step” — surfacing reasoning lifts accuracy on hard problems."],
      ["user", "Role & schema", "Personas plus strict output schemas keep answers on-spec and parseable."],
      ["random", "Self-consistency", "Sample many reasoning paths, then vote — the majority answer wins."],
    ];
    tech.forEach(([ic, name, desc], i) => {
      const x = 3.72 + (i % 2) * 2.96, y = 1.32 + Math.floor(i / 2) * 1.95;
      card(s, x, y, 2.82, 1.8);
      iconChip(s, ic, x + 0.44, y + 0.42, 0.44, "s1");
      s.addText(name, { x: x + 0.78, y: y + 0.24, w: 1.95, h: 0.36, fontFace: SANS, fontSize: 12.5, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: x + 0.22, y: y + 0.74, w: 2.42, h: 0.95, valign: "top", fontFace: SANS, fontSize: 9.5, color: MUT, margin: 0 });
    });
    rail(s, 0, "03 / 10");
    s.addNotes("Prompt engineering made the model programmable in plain language. Emphasize: no fine-tuning, no infrastructure — just the ask.");
  }

  // ============ S4 · STAGE 1 — LIMITATIONS ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 01 // LIMITATIONS", C.s1);
    title(s, "Where Prompting Hit the Wall");

    const lims = [
      ["history", "Stateless by default", "Every request starts from zero — nothing carries across turns or tasks."],
      ["compress", "A hard context ceiling", "Tiny windows meant long documents and histories simply didn't fit."],
      ["warn", "No grounding", "Knowledge froze at training time, so models hallucinated confidently."],
      ["ban", "No hands", "The model could talk about the world but never act on it."],
    ];
    lims.forEach(([ic, name, desc], i) => {
      const x = 0.5 + (i % 2) * 4.65, y = 1.32 + Math.floor(i / 2) * 1.48;
      card(s, x, y, 4.35, 1.32);
      iconChip(s, ic, x + 0.42, y + 0.42, 0.44, "s1");
      s.addText(name, { x: x + 0.76, y: y + 0.2, w: 3.4, h: 0.32, fontFace: SANS, fontSize: 13, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: x + 0.76, y: y + 0.56, w: 3.4, h: 0.62, valign: "top", fontFace: SANS, fontSize: 10, color: MUT, margin: 0 });
    });

    s.addText([
      { text: "The bottleneck moved from ", options: { italic: true } },
      { text: "how you ask", options: { italic: true, bold: true, color: C.s1 } },
      { text: " to ", options: { italic: true } },
      { text: "what the model sees", options: { italic: true, bold: true, color: C.s2 } },
      { text: "  →  enter Context Engineering.", options: { italic: true } },
    ], {
      shape: P.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08,
      fill: { color: TINT.s2 }, line: { color: DIML.s2, width: 0.75 },
      x: 0.5, y: 4.38, w: 9, h: 0.62, align: "center", fontFace: SANS, fontSize: 12.5, color: TXT, margin: 0.05,
    });
    rail(s, 0, "04 / 10");
    s.addNotes("Each card is a structural failure, not a prompt-writing failure — that's why better prompts couldn't fix them. The violet banner hands off to Stage 2.");
  }

  // ============ S5 · STAGE 2 — WHY CONTEXT ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 02 // 2023–2025 · CONTEXT ENGINEERING", C.s2);
    title(s, "Context Is the Controllable Half");
    s.addText("“The model is fixed. The context window is the only thing you engineer.”", {
      x: 0.5, y: 1.22, w: 9, h: 0.3, fontFace: SANS, fontSize: 12.5, italic: true, color: MUT, margin: 0,
    });

    const whys = [
      ["layer", "Output is a function of input", "Change the window, change the behavior — context is deterministic leverage."],
      ["bolt", "Context is scarce & costly", "Tokens cost money and attention; junk crowds out signal and degrades reasoning."],
      ["brain", "Models are stateless", "Memory isn't a feature you get — it's a system you build."],
    ];
    whys.forEach(([ic, name, desc], i) => {
      const y = 1.82 + i * 1.1;
      iconChip(s, ic, 0.7, y + 0.2, 0.4, "s2");
      s.addText(name, { x: 1.02, y, w: 3.75, h: 0.28, fontFace: SANS, fontSize: 12.5, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: 1.02, y: y + 0.32, w: 3.75, h: 0.6, valign: "top", fontFace: SANS, fontSize: 10, color: MUT, margin: 0 });
    });

    // diagram: sources -> context window -> LLM -> grounded action
    const chips = [["Knowledge · RAG", 1.85], ["Memory", 2.47], ["Tool results", 3.09], ["User goal", 3.71]];
    chips.forEach(([t, y]) => {
      s.addText(t, {
        shape: P.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06,
        fill: { color: TINT.s2 }, line: { color: DIML.s2, width: 0.75 },
        x: 5.15, y, w: 1.5, h: 0.52, align: "center", valign: "middle",
        fontFace: SANS, fontSize: 9.5, color: TXT, margin: 0,
      });
    });
    arrow(s, 6.68, 2.11, 0.4, 0.91, DIML.s2);
    arrow(s, 6.68, 2.73, 0.4, 0.29, DIML.s2);
    arrow(s, 6.68, 3.02, 0.4, 0.33, DIML.s2, true);
    arrow(s, 6.68, 3.02, 0.4, 0.95, DIML.s2, true);
    s.addText([
      { text: "CONTEXT", options: { fontSize: 11, bold: true, color: C.s2, breakLine: true } },
      { text: "WINDOW", options: { fontSize: 11, bold: true, color: C.s2, breakLine: true } },
      { text: "working memory", options: { fontSize: 8, color: FNT } },
    ], {
      shape: P.shapes.ROUNDED_RECTANGLE, rectRadius: 0.07,
      fill: { color: BG }, line: { color: C.s2, width: 1.5 },
      x: 7.1, y: 2.52, w: 1.42, h: 1.0, align: "center", valign: "middle", fontFace: SANS, margin: 0,
    });
    arrow(s, 8.56, 3.02, 0.3, 0, C.s2);
    s.addText("LLM", {
      shape: P.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06,
      fill: { color: TINT.s2 }, line: { color: DIML.s2, width: 0.75 },
      x: 8.88, y: 2.4, w: 0.62, h: 0.5, align: "center", valign: "middle",
      fontFace: SANS, fontSize: 11, bold: true, color: TXT, margin: 0,
    });
    arrow(s, 9.19, 2.92, 0, 0.38, C.s2);
    s.addText("Grounded action", {
      shape: P.shapes.ROUNDED_RECTANGLE, rectRadius: 0.06,
      fill: { color: TINT.s2 }, line: { color: DIML.s2, width: 0.75 },
      x: 8.42, y: 3.32, w: 1.55, h: 0.55, align: "center", valign: "middle",
      fontFace: SANS, fontSize: 9.5, color: TXT, margin: 0,
    });
    s.addText("// every input on the left is now an engineering decision", {
      x: 5.15, y: 4.52, w: 4.35, h: 0.2, fontFace: MONO, fontSize: 8.5, color: FNT, margin: 0,
    });
    rail(s, 1, "05 / 10");
    s.addNotes("Key reframe: you can't change the weights, but you fully own the window. The diagram shows the four input classes every context system manages.");
  }

  // ============ S6 · STAGE 2 — KEY TECHNOLOGIES ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 02 // KEY TECHNOLOGIES", C.s2);
    title(s, "RAG, Memory, and Tool Use");

    const tech = [
      ["db", "RAG", "Retrieve live knowledge at query time; ground every claim in sources.",
        ["Embeddings + vector search", "Chunking, reranking, citations"]],
      ["brain", "Memory", "Give the agent state that survives the turn — and the session.",
        ["Short-term: window + summaries", "Long-term: persistent recall"]],
      ["tools", "Tool use", "Let the model act: call APIs, run code, touch external systems.",
        ["Function calling (2023)", "MCP — one port for all tools (2024)"]],
    ];
    tech.forEach(([ic, name, role, rows], i) => {
      const x = 0.5 + i * 3.17;
      card(s, x, 1.32, 2.96, 3.78);
      iconChip(s, ic, x + 0.51, 1.83, 0.52, "s2");
      s.addText(name, { x: x + 0.92, y: 1.6, w: 1.9, h: 0.42, fontFace: SANS, fontSize: 16, bold: true, color: TXT, margin: 0 });
      s.addText(role, { x: x + 0.25, y: 2.28, w: 2.45, h: 0.72, valign: "top", fontFace: SANS, fontSize: 10, color: MUT, margin: 0 });
      s.addShape(P.shapes.LINE, { x: x + 0.25, y: 3.14, w: 2.45, h: 0, line: { color: "232E4A", width: 0.75 } });
      s.addText("IN PRACTICE", { x: x + 0.25, y: 3.26, w: 2.4, h: 0.18, fontFace: MONO, fontSize: 8.5, color: C.s2, charSpacing: 1.5, margin: 0 });
      rows.forEach((r, j) => {
        const y = 3.58 + j * 0.52;
        s.addShape(P.shapes.OVAL, { x: x + 0.27, y: y + 0.055, w: 0.05, h: 0.05, fill: { color: C.s2 } });
        s.addText(r, { x: x + 0.44, y, w: 2.32, h: 0.48, valign: "top", fontFace: SANS, fontSize: 9.5, color: MUT, margin: 0 });
      });
    });
    rail(s, 1, "06 / 10");
    s.addNotes("Three pillars. RAG solves grounding, memory solves state, tool use solves action. MCP in 2024 matters because it standardized the tool layer across vendors.");
  }

  // ============ S7 · STAGE 3 — HARNESS ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 03 // 2025 → · HARNESS ENGINEERING", C.s3);
    title(s, "Build the Harness, Not Just the Prompt");
    s.addText(
      "The harness is the runtime wrapped around the model — it plans, acts, verifies, and recovers, so no single prompt has to be perfect.",
      { x: 0.5, y: 1.2, w: 9, h: 0.42, fontFace: SANS, fontSize: 12, color: MUT, margin: 0 }
    );

    const comps = [
      ["sync", "Agent loop", "Plan → act → observe → repeat until done."],
      ["plug", "Tools & MCP", "Standard ports to code, data, and services."],
      ["shield", "Guardrails", "Sandboxes, approvals, spend & scope limits."],
      ["vial", "Evals & memory", "Score every run; persist what works."],
    ];
    comps.forEach(([ic, name, desc], i) => {
      const x = 0.5 + i * 2.28;
      card(s, x, 1.74, 2.15, 1.28);
      iconChip(s, ic, x + 0.38, 2.12, 0.4, "s3");
      s.addText(name, { x: x + 0.64, y: 1.94, w: 1.45, h: 0.38, fontFace: SANS, fontSize: 11, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: x + 0.18, y: 2.42, w: 1.82, h: 0.52, valign: "top", fontFace: SANS, fontSize: 9, color: MUT, margin: 0 });
    });

    s.addText("// FRAMEWORK EVOLUTION", { x: 0.5, y: 3.3, w: 4, h: 0.2, fontFace: MONO, fontSize: 9, color: C.s3, charSpacing: 2, margin: 0 });
    const steps = [
      ["2023", "AutoGPT", "first viral autonomous loop"],
      ["2023–24", "LangChain, LlamaIndex", "composable agent toolkits"],
      ["2024", "MCP", "tools get a standard port"],
      ["2025", "Agentic CLIs", "coding agents ship as products"],
      ["2026 →", "Harness era", "gateways, sub-agents, runtimes"],
    ];
    steps.forEach(([yr, name, desc], i) => {
      const x = 0.5 + i * 1.81;
      card(s, x, 3.62, 1.62, 1.32);
      s.addText(yr, { x: x + 0.15, y: 3.76, w: 1.35, h: 0.18, fontFace: MONO, fontSize: 8.5, bold: true, color: C.s3, margin: 0 });
      s.addText(name, { x: x + 0.15, y: 3.98, w: 1.35, h: 0.56, valign: "top", fontFace: SANS, fontSize: 10.5, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: x + 0.15, y: 4.56, w: 1.35, h: 0.34, valign: "top", fontFace: SANS, fontSize: 8.5, color: MUT, margin: 0 });
      if (i < 4) arrow(s, x + 1.65, 4.28, 0.13, 0, "3A4A6B");
    });
    rail(s, 2, "07 / 10");
    s.addNotes("Definition first, then the four subsystems, then how frameworks matured: from one brave loop (AutoGPT) to standardized, productized runtimes.");
  }

  // ============ S8 · STAGE 3 — REPRESENTATIVE AGENTS ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "STAGE 03 // REPRESENTATIVE AGENTS", C.s3);
    title(s, "Five Agents That Define the Era");

    const agents = [
      ["rocket", "AutoGPT", "2023", "THE PIONEER", "First viral open-source autonomous agent: a goal-driven think–act loop. Harnesses proved buildable — and hard."],
      ["search", "DeepAgent", "2025", "DEEP RESEARCH", "Planning tool + sub-agents + a virtual file system, tuned for long-horizon, multi-step research tasks."],
      ["exch", "ACPAgent", "2025", "PROTOCOL-NATIVE", "Speaks open agent–client protocols, so one agent plugs into many IDEs, editors, and frontends."],
      ["server", "OpenClaw", "2026", "SELF-HOSTED", "Open-source personal-assistant gateway — connects to your chat channels and runs on your own hardware."],
      ["feather", "HermesAgent", "2026", "OPEN-WEIGHT", "The Hermes model family paired with a task-harness runtime for tool use and long-running jobs."],
    ];
    const draw = ([ic, name, yr, tag, desc], i, special) => {
      const x = 0.5 + (i % 3) * 3.17, y = 1.32 + Math.floor(i / 3) * 2.02;
      card(s, x, y, 2.96, 1.86, special ? TINT.s3 : CARD, special ? DIML.s3 : CARD_LINE);
      iconChip(s, ic, x + 0.41, y + 0.39, 0.42, "s3");
      s.addText(name, { x: x + 0.72, y: y + 0.2, w: 1.55, h: 0.3, fontFace: SANS, fontSize: 13.5, bold: true, color: TXT, margin: 0 });
      s.addText(yr, { x: x + 2.24, y: y + 0.24, w: 0.55, h: 0.18, align: "right", fontFace: MONO, fontSize: 8.5, color: FNT, margin: 0 });
      s.addText(tag, { x: x + 0.72, y: y + 0.5, w: 2.0, h: 0.18, fontFace: MONO, fontSize: 8.5, color: C.s3, charSpacing: 1, margin: 0 });
      s.addText(desc, { x: x + 0.2, y: y + 0.86, w: 2.56, h: 0.9, valign: "top", fontFace: SANS, fontSize: 9.5, color: special ? TXT : MUT, margin: 0 });
    };
    agents.forEach((a, i) => draw(a, i, false));
    // pattern card completes the 3×2 grid
    card(s, 6.84, 3.34, 2.96, 1.86, TINT.s3, DIML.s3);
    iconChip(s, "bulb", 7.25, 3.73, 0.42, "s3");
    s.addText("Pattern", { x: 7.56, y: 3.54, w: 1.55, h: 0.3, fontFace: SANS, fontSize: 13.5, bold: true, color: TXT, margin: 0 });
    s.addText("COMMON THREAD", { x: 7.56, y: 3.84, w: 2.0, h: 0.18, fontFace: MONO, fontSize: 8.5, color: C.s3, charSpacing: 1, margin: 0 });
    s.addText("Plan → act → verify loops, standardized tools via MCP, and a human on the approval path.", {
      x: 7.04, y: 4.2, w: 2.56, h: 0.9, valign: "top", fontFace: SANS, fontSize: 9.5, color: TXT, margin: 0,
    });
    rail(s, 2, "08 / 10");
    s.addNotes("Five products, five postures: pioneer, deep-research harness, protocol-native, self-hosted gateway, open-weight stack. The pattern card is the synthesis.");
  }

  // ============ S9 · COMPARISON TABLE ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "// SYNTHESIS", MUT);
    title(s, "Three Paradigms, Side by Side");

    const hdr = (t, col) => ({ text: t, options: { fontFace: SANS, fontSize: 11.5, bold: true, color: col, fill: { color: "141C2E" }, valign: "middle", margin: 0.08 } });
    const dim = (t) => ({ text: t, options: { fontFace: SANS, fontSize: 10, bold: true, color: MUT, fill: { color: "101828" }, valign: "middle", margin: 0.08 } });
    const cell = (t, i) => ({ text: t, options: { fontFace: SANS, fontSize: 10.5, color: TXT, fill: { color: i % 2 ? "0E1524" : "0B111E" }, valign: "middle", margin: 0.08 } });

    const rows = [
      [{ text: "", options: { fill: { color: "141C2E" } } }, hdr("Prompt Engineering", C.s1), hdr("Context Engineering", C.s2), hdr("Harness Engineering", C.s3)],
    ];
    [
      ["Core question", "How do I ask?", "What does the model see?", "What surrounds the model?"],
      ["Unit of work", "A single prompt", "The context window", "The whole agent runtime"],
      ["Key tech", "Few-shot, CoT, role prompts", "RAG, memory, function calling", "Loops, MCP tools, guardrails, evals"],
      ["Failure mode", "Brittle asks, hallucination", "Context rot, token burn", "Runaway loops, unsafe actions"],
      ["Era", "2020 – 2023", "2023 – 2025", "2025 →"],
    ].forEach(([d, a, b, c2], i) => rows.push([dim(d), cell(a, i), cell(b, i), cell(c2, i)]));

    s.addTable(rows, {
      x: 0.5, y: 1.32, w: 9, colW: [1.7, 2.43, 2.43, 2.44],
      rowH: [0.5, 0.58, 0.58, 0.58, 0.58, 0.58],
      border: { pt: 0.75, color: "232E4A" },
    });
    rail(s, "all", "09 / 10");
    s.addNotes("Read one row at a time. The 'unit of work' row is the sharpest differentiator: prompt → window → runtime.");
  }

  // ============ S10 · TAKEAWAY ============
  {
    const s = P.addSlide();
    bg(s);
    kicker(s, "// THE TAKEAWAY", C.s1);
    title(s, "Each Stage Wrapped the Last", 0.58, 32);
    nodeGraph(s,
      [[8.7, 0.4, 0.05, C.s2, 65], [9.4, 0.68, 0.07, C.s1, 60], [9.05, 1.1, 0.04, C.s3, 70]],
      [[0, 1], [1, 2]]);

    const takes = [
      ["terminal", "s1", "Prompts became components", "The perfect ask still matters — now it's one input among many."],
      ["layer", "s2", "Context became a resource", "Retrieval, memory, and tools turned the window into managed working memory."],
      ["diagram", "s3", "Harnesses became the product", "The differentiator moved to loops, guardrails, and evals around the model."],
    ];
    takes.forEach(([ic, st, name, desc], i) => {
      const y = 1.5 + i * 1.02;
      iconChip(s, ic, 0.7, y + 0.2, 0.4, st);
      s.addText(name, { x: 1.02, y, w: 3.9, h: 0.28, fontFace: SANS, fontSize: 12.5, bold: true, color: TXT, margin: 0 });
      s.addText(desc, { x: 1.02, y: y + 0.32, w: 3.9, h: 0.6, valign: "top", fontFace: SANS, fontSize: 10, color: MUT, margin: 0 });
    });
    s.addText("> next: agents that improve their own harnesses", {
      x: 0.5, y: 4.68, w: 4.6, h: 0.24, fontFace: MONO, fontSize: 10.5, color: C.s1, margin: 0,
    });

    // nested layers: harness ⊃ context ⊃ prompt
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 5.6, y: 1.42, w: 3.7, h: 3.42, rectRadius: 0.1, fill: { color: C.s3, transparency: 92 }, line: { color: DIML.s3, width: 1.25 } });
    s.addText("HARNESS — the runtime", { x: 5.6, y: 1.56, w: 3.7, h: 0.2, align: "center", fontFace: MONO, fontSize: 9, color: C.s3, charSpacing: 1, margin: 0 });
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 6.05, y: 1.95, w: 2.8, h: 2.55, rectRadius: 0.09, fill: { color: C.s2, transparency: 90 }, line: { color: DIML.s2, width: 1.25 } });
    s.addText("CONTEXT — what it sees", { x: 6.05, y: 2.09, w: 2.8, h: 0.2, align: "center", fontFace: MONO, fontSize: 9, color: C.s2, charSpacing: 1, margin: 0 });
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 6.55, y: 2.68, w: 1.8, h: 1.4, rectRadius: 0.08, fill: { color: C.s1, transparency: 88 }, line: { color: DIML.s1, width: 1.25 } });
    s.addText([
      { text: "PROMPT", options: { fontFace: SANS, fontSize: 13, bold: true, color: C.s1, breakLine: true } },
      { text: "how it's asked", options: { fontFace: MONO, fontSize: 8, color: FNT } },
    ], { x: 6.55, y: 2.68, w: 1.8, h: 1.4, align: "center", valign: "middle", margin: 0 });

    rail(s, "all", "10 / 10");
    s.addNotes("Close on the nesting visual: nothing was abandoned — prompts live inside context, context lives inside the harness. Invite questions.");
  }

  await P.writeFile({ fileName: "Z:/GITHUB/agentic-project-template/The-Evolution-of-AI-Agents.pptx" });
  console.log("written");
}

build().catch((e) => { console.error(e); process.exit(1); });

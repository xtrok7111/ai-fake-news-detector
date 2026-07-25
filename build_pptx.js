/*
 * Build Presentation.pptx — AI Fake News Detector (Graduation Project)
 * SIMPLE, CLEAN version with real screenshots from the project report.
 * Dark navy theme, minimal decoration, focus on content.
 */
module.paths.unshift("C:\\Users\\Turki\\AppData\\Roaming\\npm\\node_modules");
const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI Fake News Detector";
pres.author = "Turki Ali Alrayeh, Bader Ahmed Alghamdi, Turki Mohammed Alsaiari";

// =====================================================================
// PALETTE — minimal, professional
// =====================================================================
const C = {
  bg:      "0A0E1A",
  card:    "1B233A",
  border:  "2A3550",
  cyan:    "06B6D4",
  magenta: "D946EF",
  purple:  "8B5CF6",
  green:   "22C55E",
  red:     "F43F5E",
  orange:  "F59E0B",
  text:    "F1F5FB",
  soft:    "C5CDDE",
  muted:   "8A93AB",
};

const ASSETS = path.resolve("_report/media");
const LOGO_APP  = path.resolve("frontend/public/logo.png");
const LOGO_UNI  = path.resolve("frontend/public/sattam-logo.png");

const SW = 10, SH = 5.625;

// =====================================================================
// HELPERS
// =====================================================================
function baseSlide(num, tagText) {
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Thin top accent line — simple, no decorative shapes
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: SW, h: 0.045,
    fill: { color: C.magenta },
    line: { color: C.magenta, width: 0, transparency: 100 },
  });

  if (tagText) {
    s.addText(tagText.toUpperCase(), {
      x: 0.5, y: 0.18, w: 7, h: 0.32,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: C.cyan, charSpacing: 4, margin: 0,
    });
  }

  s.addText(`${num} / 15`, {
    x: SW - 1.2, y: SH - 0.4, w: 0.8, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: C.muted, align: "right", margin: 0,
  });

  s.addText("AI Fake News Detector  ·  PSAU 2025", {
    x: 0.5, y: SH - 0.4, w: 5, h: 0.3,
    fontFace: "Calibri", fontSize: 9,
    color: C.muted, margin: 0,
  });

  return s;
}

function heading(s, plain, accent, y = 0.65) {
  s.addText([
    { text: plain + " ", options: { color: C.text, bold: true } },
    { text: accent, options: { color: C.magenta, bold: true } },
  ], {
    x: 0.5, y: y, w: 9, h: 0.75,
    fontFace: "Calibri", fontSize: 32, margin: 0,
  });
}

function sub(s, text, y = 1.35) {
  s.addText(text, {
    x: 0.5, y: y, w: 9, h: 0.45,
    fontFace: "Calibri", fontSize: 14,
    color: C.soft, margin: 0,
  });
}

function badge(s, x, y, size, color, text) {
  s.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color },
    line: { color: "FFFFFF", width: 0, transparency: 100 },
  });
  s.addText(text, {
    x, y, w: size, h: size,
    fontFace: "Calibri", fontSize: Math.round(size * 28),
    bold: true, color: C.bg,
    align: "center", valign: "middle", margin: 0,
  });
}

function screenshotFrame(s, x, y, w, h, imagePath, caption, accent) {
  // Thin frame
  s.addShape(pres.shapes.RECTANGLE, {
    x: x - 0.05, y: y - 0.05, w: w + 0.1, h: h + 0.1,
    fill: { color: C.card },
    line: { color: accent || C.cyan, width: 1 },
  });
  s.addImage({
    path: imagePath,
    x, y, w, h,
    sizing: { type: "contain", w, h },
  });
  if (caption) {
    s.addText(caption, {
      x, y: y + h + 0.1, w, h: 0.3,
      fontFace: "Calibri", fontSize: 11, italic: true,
      color: C.muted, align: "center", margin: 0,
    });
  }
}

// =====================================================================
// SLIDE 1 — TITLE
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Top accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: SW, h: 0.045,
    fill: { color: C.magenta },
    line: { color: C.magenta, width: 0, transparency: 100 },
  });

  // Logo
  s.addImage({ path: LOGO_APP, x: SW / 2 - 0.7, y: 0.45, w: 1.4, h: 1.4 });

  // Title
  s.addText("AI Fake News Detector", {
    x: 0.5, y: 2.0, w: 9, h: 0.8,
    fontFace: "Calibri", fontSize: 42, bold: true,
    color: C.text, align: "center", margin: 0,
  });

  // Subtitle
  s.addText("Detection and Classification of Misinformation Using Artificial Intelligence", {
    x: 1, y: 2.85, w: 8, h: 0.4,
    fontFace: "Calibri", fontSize: 15,
    color: C.cyan, italic: true, align: "center", margin: 0,
  });

  // Team
  s.addText("PRESENTED BY", {
    x: 0.5, y: 3.55, w: 9, h: 0.25,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: C.muted, charSpacing: 3, align: "center", margin: 0,
  });
  s.addText([
    { text: "Turki Ali Alrayeh", options: { breakLine: true } },
    { text: "Bader Ahmed Alghamdi", options: { breakLine: true } },
    { text: "Turki Mohammed Alsaiari" },
  ], {
    x: 0.5, y: 3.8, w: 9, h: 0.9,
    fontFace: "Calibri", fontSize: 13,
    color: C.soft, align: "center", margin: 0,
  });

  // Supervisor
  s.addText("Supervised by Dr. Bader Mattar Alotaibi", {
    x: 0.5, y: 4.7, w: 9, h: 0.3,
    fontFace: "Calibri", fontSize: 12, italic: true,
    color: C.muted, align: "center", margin: 0,
  });

  // University strip
  s.addImage({
    path: LOGO_UNI,
    x: 3.6, y: 5.1, w: 0.4, h: 0.35,
    sizing: { type: "contain", w: 0.4, h: 0.35 },
  });
  s.addText("Prince Sattam Bin Abdulaziz University  ·  December 2025", {
    x: 4.1, y: 5.1, w: 5, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true,
    color: C.text, valign: "middle", margin: 0,
  });
}

// =====================================================================
// SLIDE 2 — PROBLEM
// =====================================================================
{
  const s = baseSlide(2, "Chapter 1");
  heading(s, "The", "Problem");
  sub(s, "Misinformation spreads faster than verified news — undermining health, politics, and public trust.");

  const points = [
    ["Lack of Transparency", "Existing detectors return only a true/false label with no justification."],
    ["Manual Verification",  "Human fact-checkers cannot keep pace with online content volume."],
    ["Limited Accessibility","Most fact-checking platforms have complex or restricted interfaces."],
    ["Eroded User Trust",    "Without reasoning, users dismiss AI verdicts as unreliable."],
  ];
  points.forEach((p, i) => {
    const y = 2.0 + i * 0.7;
    badge(s, 0.55, y + 0.05, 0.42, C.magenta, String(i + 1));
    s.addText([
      { text: p[0], options: { bold: true, color: C.text, breakLine: true } },
      { text: p[1], options: { color: C.soft } },
    ], {
      x: 1.15, y: y, w: 8.3, h: 0.65,
      fontFace: "Calibri", fontSize: 13, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 3 — OBJECTIVES
// =====================================================================
{
  const s = baseSlide(3, "Chapter 1");
  heading(s, "Project", "Objectives");
  sub(s, "Goals this project aims to achieve.");

  const objs = [
    "Build an AI-based web platform that detects fake news automatically.",
    "Apply TF-IDF + Logistic Regression for fast and accurate classification.",
    "Add an explainability layer (LIME) that reveals WHY a prediction was made.",
    "Provide a confidence score and risk level for every analysed article.",
    "Deliver the tool through a web application and a browser extension.",
    "Encourage critical thinking about online news content.",
  ];

  objs.forEach((text, i) => {
    const y = 2.0 + i * 0.5;
    badge(s, 0.55, y, 0.36, C.cyan, String(i + 1));
    s.addText(text, {
      x: 1.1, y: y - 0.02, w: 8.35, h: 0.42,
      fontFace: "Calibri", fontSize: 13,
      color: C.soft, valign: "middle", margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 4 — PROPOSED SOLUTION
// =====================================================================
{
  const s = baseSlide(4, "Chapter 1");
  heading(s, "Proposed", "Solution");
  sub(s, "A web platform that turns a pasted article into an explained verdict in one step.");

  const steps = [
    ["1", "Input",   "User pastes a news article into the web app.",                C.cyan],
    ["2", "Analyse", "Model classifies it as Real or Fake with a confidence score.", C.magenta],
    ["3", "Explain", "LIME highlights the words that drove the decision.",           C.orange],
  ];

  steps.forEach((st, i) => {
    const x = 0.55 + i * 3.05;
    const y = 2.1;
    const w = 2.85, h = 2.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card },
      line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.05,
      fill: { color: st[3] },
      line: { color: "FFFFFF", width: 0, transparency: 100 },
    });
    s.addText(st[0], {
      x: x + 0.25, y: y + 0.25, w: 0.9, h: 0.9,
      fontFace: "Calibri", fontSize: 52, bold: true,
      color: st[3], margin: 0,
    });
    s.addText(st[1], {
      x: x + 0.25, y: y + 1.3, w: w - 0.5, h: 0.5,
      fontFace: "Calibri", fontSize: 22, bold: true,
      color: C.text, margin: 0,
    });
    s.addText(st[2], {
      x: x + 0.25, y: y + 1.9, w: w - 0.5, h: 0.85,
      fontFace: "Calibri", fontSize: 12,
      color: C.soft, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 5 — USE CASE DIAGRAM (from report)
// =====================================================================
{
  const s = baseSlide(5, "Chapter 3 — System Analysis");
  heading(s, "Use Case", "Diagram");
  sub(s, "How users and the admin interact with the system.");

  s.addImage({
    path: path.join(ASSETS, "image2.png"),
    x: 1.5, y: 1.85, w: 7, h: 3.3,
    sizing: { type: "contain", w: 7, h: 3.3 },
  });
}

// =====================================================================
// SLIDE 6 — SYSTEM ARCHITECTURE
// =====================================================================
{
  const s = baseSlide(6, "Chapter 4 — Design");
  heading(s, "System", "Architecture");
  sub(s, "A three-tier separation of concerns.");

  const layers = [
    ["1", "Presentation Tier  —  React.js",
      "Login, Analyse, Dashboard, Model Info, About Us + Chrome extension.", C.magenta],
    ["2", "Application Tier  —  Flask (Python)",
      "REST API, JWT authentication, ML inference, LIME explanation.", C.cyan],
    ["3", "Data Tier  —  SQLite",
      "Three tables (Users, History, Model_Info) + the trained .pkl pipeline.", C.green],
  ];
  layers.forEach((l, i) => {
    const y = 2.0 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 8.9, h: 0.9,
      fill: { color: C.card },
      line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.55, y, w: 0.1, h: 0.9,
      fill: { color: l[3] },
      line: { color: "FFFFFF", width: 0, transparency: 100 },
    });
    badge(s, 0.85, y + 0.2, 0.5, l[3], l[0]);
    s.addText(l[1], {
      x: 1.5, y: y + 0.13, w: 7.8, h: 0.35,
      fontFace: "Calibri", fontSize: 15, bold: true,
      color: C.text, margin: 0,
    });
    s.addText(l[2], {
      x: 1.5, y: y + 0.48, w: 7.8, h: 0.35,
      fontFace: "Calibri", fontSize: 11,
      color: C.soft, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 7 — TECHNOLOGY STACK
// =====================================================================
{
  const s = baseSlide(7, "Chapter 4");
  heading(s, "Technology", "Stack");
  sub(s, "Tools and frameworks used in the project.");

  const tech = [
    ["R",  "React.js",      "Frontend single-page app",        C.cyan],
    ["F",  "Flask",         "Python REST API backend",         C.magenta],
    ["SK", "scikit-learn",  "TF-IDF + Logistic Regression",    C.green],
    ["L",  "LIME",          "Explainable AI",                  C.orange],
    ["SQ", "SQLite",        "Embedded database",               C.purple],
    ["M3", "Manifest V3",   "Chrome extension",                C.cyan],
  ];

  tech.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.55 + col * 3.05;
    const y = 2.0 + row * 1.5;
    const w = 2.85, h = 1.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card },
      line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.05,
      fill: { color: t[3] },
      line: { color: "FFFFFF", width: 0, transparency: 100 },
    });
    badge(s, x + 0.25, y + 0.2, 0.5, t[3], t[0]);
    s.addText(t[1], {
      x: x + 0.85, y: y + 0.2, w: w - 1.05, h: 0.35,
      fontFace: "Calibri", fontSize: 15, bold: true,
      color: C.text, margin: 0,
    });
    s.addText(t[2], {
      x: x + 0.85, y: y + 0.55, w: w - 1.05, h: 0.65,
      fontFace: "Calibri", fontSize: 11,
      color: C.soft, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 8 — IMPLEMENTATION PIPELINE
// =====================================================================
{
  const s = baseSlide(8, "Chapter 5 — System Design");
  heading(s, "How It", "Works");
  sub(s, "From raw text to an explained verdict in under one second.");

  const stages = [
    ["1", "Input",       "raw text",          C.cyan],
    ["2", "Preprocess",  "clean + lemmatise", C.cyan],
    ["3", "TF-IDF",      "vectorise",         C.purple],
    ["4", "Classifier",  "Logistic Reg.",     C.magenta],
    ["5", "LIME",        "explain",           C.orange],
    ["6", "Output",      "verdict + score",   C.green],
  ];
  const N = stages.length;
  const boxW = 1.35, boxH = 1.35, gap = 0.13;
  const totalW = N * boxW + (N - 1) * gap;
  const startX = (SW - totalW) / 2;
  const y = 2.1;

  stages.forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: boxW, h: boxH,
      fill: { color: C.card },
      line: { color: st[3], width: 1 },
    });
    badge(s, x + boxW / 2 - 0.25, y + 0.18, 0.5, st[3], st[0]);
    s.addText(st[1], {
      x, y: y + 0.78, w: boxW, h: 0.3,
      fontFace: "Calibri", fontSize: 12, bold: true,
      color: C.text, align: "center", margin: 0,
    });
    s.addText(st[2], {
      x, y: y + 1.02, w: boxW, h: 0.3,
      fontFace: "Calibri", fontSize: 9,
      color: C.muted, align: "center", margin: 0,
    });
    if (i < N - 1) {
      s.addText("→", {
        x: x + boxW, y: y + boxH / 2 - 0.2, w: gap + 0.05, h: 0.4,
        fontFace: "Calibri", fontSize: 18, bold: true,
        color: C.magenta, align: "center", valign: "middle", margin: 0,
      });
    }
  });

  const notes = [
    ["Preprocessing",       "lowercase, strip URLs and punctuation, remove stopwords, lemmatise."],
    ["TF-IDF Vectorisation","converts text into ~15,000 numerical features (unigrams + bigrams)."],
    ["Logistic Regression", "predicts Real or Fake and outputs a probabilistic confidence score."],
  ];
  notes.forEach((n, i) => {
    const ny = 4.0 + i * 0.42;
    badge(s, 0.55, ny + 0.03, 0.28, C.magenta, String(i + 1));
    s.addText([
      { text: n[0] + ":  ", options: { bold: true, color: C.text } },
      { text: n[1], options: { color: C.soft } },
    ], {
      x: 0.95, y: ny, w: 8.5, h: 0.35,
      fontFace: "Calibri", fontSize: 11, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 9 — DATASET & MODEL
// =====================================================================
{
  const s = baseSlide(9, "Chapter 6 — Dataset Analysis");
  heading(s, "Dataset", "& Model");
  sub(s, "Trained on the Kaggle Fake and Real News Dataset.");

  const stats = [
    ["44,898", "Total Articles",  C.cyan],
    ["23,481", "Fake News",       C.magenta],
    ["21,417", "Real News",       C.green],
    ["98.37%", "Test Accuracy",   C.orange],
  ];
  stats.forEach((st, i) => {
    const x = 0.55 + i * 2.27;
    const y = 2.0;
    const w = 2.15, h = 1.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card },
      line: { color: C.border, width: 0.5 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h: 0.05,
      fill: { color: st[2] },
      line: { color: "FFFFFF", width: 0, transparency: 100 },
    });
    s.addText(st[0], {
      x, y: y + 0.3, w, h: 0.7,
      fontFace: "Calibri", fontSize: 28, bold: true,
      color: st[2], align: "center", margin: 0,
    });
    s.addText(st[1].toUpperCase(), {
      x, y: y + 1.05, w, h: 0.35,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: C.muted, align: "center", charSpacing: 2, margin: 0,
    });
  });

  const notes = [
    "Class labels: Fake.csv → 0   |   True.csv → 1.",
    "Split: 80% training / 20% testing (stratified by class).",
    "Chosen over SVM and Naïve Bayes for best balance of accuracy, speed, and explainability.",
  ];
  notes.forEach((n, i) => {
    const ny = 3.85 + i * 0.42;
    badge(s, 0.55, ny + 0.03, 0.28, C.magenta, String(i + 1));
    s.addText(n, {
      x: 0.95, y: ny, w: 8.5, h: 0.35,
      fontFace: "Calibri", fontSize: 12,
      color: C.soft, margin: 0,
    });
  });
}

// =====================================================================
// SLIDE 10 — LOGIN & REGISTER (screenshots)
// =====================================================================
{
  const s = baseSlide(10, "Chapter 6 — Implementation");
  heading(s, "Authentication", "Screens");
  sub(s, "Sign In and Create Account pages with secure SHA-256 hashing and JWT tokens.");

  screenshotFrame(s, 0.85, 1.95, 3.8, 3.05,
    path.join(ASSETS, "image8.jpeg"),
    "Sign In Page",
    C.magenta);

  screenshotFrame(s, 5.35, 1.95, 3.8, 3.05,
    path.join(ASSETS, "image9.jpeg"),
    "Create Account Page",
    C.cyan);
}

// =====================================================================
// SLIDE 11 — VERIFY NEWS (Analyze screen)
// =====================================================================
{
  const s = baseSlide(11, "Chapter 6 — Implementation");
  heading(s, "Verify News —", "Analyze");
  sub(s, "Users paste an article; the model returns a verdict instantly.");

  screenshotFrame(s, 1.5, 1.95, 7, 3.1,
    path.join(ASSETS, "image7.jpeg"),
    "Analyze page — paste an article and verify",
    C.cyan);
}

// =====================================================================
// SLIDE 12 — DETECTION RESULT (Fake example with LIME)
// =====================================================================
{
  const s = baseSlide(12, "Chapter 6 — Results");
  heading(s, "Detection", "Result");
  sub(s, "Example: a fake-news headline detected with 99.73% confidence — LIME explains why.");

  // image10 is 1119x806 (ratio 1.39). Use a frame matching that ratio.
  // Frame: 5.4 wide × 3.85 tall, centered horizontally.
  const fw = 5.4, fh = 3.85;
  const fx = (SW - fw) / 2;
  const fy = 1.85;
  screenshotFrame(s, fx, fy, fw, fh,
    path.join(ASSETS, "image10.jpeg"),
    "Verdict: FAKE  ·  Supporting and opposing words highlighted",
    C.red);
}

// =====================================================================
// SLIDE 13 — USER DASHBOARD
// =====================================================================
{
  const s = baseSlide(13, "Chapter 6 — Results");
  heading(s, "User", "Dashboard");
  sub(s, "Personal verification history with totals for Real and Fake checks.");

  screenshotFrame(s, 1.5, 1.95, 7, 3.1,
    path.join(ASSETS, "image12.jpeg"),
    "Dashboard — total checks, real/fake counts, and full history",
    C.green);
}

// =====================================================================
// SLIDE 14 — TESTING & RESULTS
// =====================================================================
{
  const s = baseSlide(14, "Chapter 7 — Testing & Evaluation");
  heading(s, "Testing &", "Results");
  sub(s, "Every major feature was validated against its acceptance criteria.");

  const tests = [
    "User Registration",
    "User Authentication",
    "News Classification",
    "PDF Report Export",
    "Dashboard Retrieval",
    "Model Metadata API",
  ];
  tests.forEach((t, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.55 + col * 3.05;
    const y = 2.0 + row * 1.05;
    const w = 2.85, h = 0.9;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card },
      line: { color: C.green, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
      fill: { color: C.green },
      line: { color: "FFFFFF", width: 0, transparency: 100 },
    });
    // Checkmark "✓" rendered as text inside the circle
    s.addText("✓", {
      x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
      fontFace: "Calibri", fontSize: 22, bold: true,
      color: C.bg, align: "center", valign: "middle", margin: 0,
    });
    s.addText(t, {
      x: x + 0.85, y: y + 0.18, w: w - 1.05, h: 0.32,
      fontFace: "Calibri", fontSize: 13, bold: true,
      color: C.text, margin: 0,
    });
    s.addText("PASSED", {
      x: x + 0.85, y: y + 0.5, w: w - 1.05, h: 0.3,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: C.green, charSpacing: 2, margin: 0,
    });
  });

  // Bottom summary strip
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 4.3, w: 8.9, h: 0.7,
    fill: { color: C.card },
    line: { color: C.border, width: 0.5 },
  });
  s.addText([
    { text: "Model accuracy:  ", options: { color: C.muted } },
    { text: "98.37%", options: { bold: true, color: C.green } },
    { text: "        Inference latency:  ", options: { color: C.muted } },
    { text: "~50 ms / article", options: { bold: true, color: C.cyan } },
    { text: "        Algorithm:  ", options: { color: C.muted } },
    { text: "TF-IDF + Logistic Regression", options: { bold: true, color: C.magenta } },
  ], {
    x: 0.55, y: 4.3, w: 8.9, h: 0.7,
    fontFace: "Calibri", fontSize: 12,
    align: "center", valign: "middle", margin: 0,
  });
}

// =====================================================================
// SLIDE 15 — THANK YOU
// =====================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: SW, h: 0.045,
    fill: { color: C.magenta },
    line: { color: C.magenta, width: 0, transparency: 100 },
  });

  s.addImage({ path: LOGO_APP, x: SW / 2 - 0.55, y: 0.6, w: 1.1, h: 1.1 });

  s.addText("Thank You", {
    x: 0.5, y: 1.85, w: 9, h: 0.95,
    fontFace: "Calibri", fontSize: 52, bold: true,
    color: C.text, align: "center", margin: 0,
  });
  s.addText("Questions & Discussion", {
    x: 0.5, y: 2.85, w: 9, h: 0.45,
    fontFace: "Calibri", fontSize: 17, italic: true,
    color: C.cyan, align: "center", margin: 0,
  });

  s.addText([
    { text: "Turki Ali Alrayeh  ·  Bader Ahmed Alghamdi  ·  Turki Mohammed Alsaiari", options: { breakLine: true, color: C.soft, bold: true } },
    { text: "Supervised by Dr. Bader Mattar Alotaibi", options: { color: C.muted } },
  ], {
    x: 0.5, y: 3.6, w: 9, h: 0.85,
    fontFace: "Calibri", fontSize: 13, align: "center", margin: 0,
  });

  s.addImage({
    path: LOGO_UNI,
    x: 3.6, y: 4.85, w: 0.4, h: 0.35,
    sizing: { type: "contain", w: 0.4, h: 0.35 },
  });
  s.addText("Prince Sattam Bin Abdulaziz University  ·  December 2025", {
    x: 4.1, y: 4.85, w: 5, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true,
    color: C.text, valign: "middle", margin: 0,
  });

  s.addText("15 / 15", {
    x: SW - 1.2, y: SH - 0.4, w: 0.8, h: 0.3,
    fontFace: "Calibri", fontSize: 10,
    color: C.muted, align: "right", margin: 0,
  });
}

// =====================================================================
// WRITE FILE
// =====================================================================
pres.writeFile({ fileName: "Presentation.pptx" })
  .then(name => console.log("Wrote: " + name))
  .catch(err => { console.error(err); process.exit(1); });

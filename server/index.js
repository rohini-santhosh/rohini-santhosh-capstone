"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const { makeRateLimit } = require("./rateLimit");
const { readRequests, addRequest } = require("./requests");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const RESEARCH_DIR = path.join(PUBLIC_DIR, "research");
const SLUG_RE = /^[a-z0-9-]{1,100}$/;

const app = express();
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// No API key, no auth, no external calls anywhere in this server — it only
// serves pre-generated research files and queues topic requests to a local
// file. See RESEARCH_METHOD.md for how new reports get made and published.

app.get("/api/research", (_req, res) => {
  try {
    const index = JSON.parse(fs.readFileSync(path.join(RESEARCH_DIR, "index.json"), "utf8"));
    res.json(index);
  } catch {
    res.json([]);
  }
});

app.get("/api/research/:slug", (req, res) => {
  const { slug } = req.params;
  if (!SLUG_RE.test(slug)) return res.status(400).json({ error: "invalid slug" });

  const filePath = path.join(RESEARCH_DIR, `${slug}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).json({ error: "report not found" });
    res.type("application/json").send(data);
  });
});

const requestRateLimit = makeRateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many topic suggestions from this visitor in the last hour. Try again later.",
});

app.post("/api/requests", requestRateLimit, (req, res) => {
  const topic = (req.body?.topic || "").toString().trim();
  const scope = (req.body?.scope || "").toString().trim();

  if (!topic) return res.status(400).json({ error: "topic is required" });
  if (topic.length > 300 || scope.length > 300) {
    return res.status(400).json({ error: "topic/scope must be under 300 characters" });
  }

  const entry = addRequest({ topic, scope });
  res.status(201).json({ id: entry.id });
});

// Lets whoever's publishing reports (see RESEARCH_METHOD.md) check the
// queue — plain JSON, no auth, since this whole app has none by design.
app.get("/api/requests", (_req, res) => {
  res.json(readRequests());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[narra] listening on port ${PORT}`);
});

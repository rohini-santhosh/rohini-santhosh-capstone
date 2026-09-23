"use strict";

// Dev-only helper: polls server/data/requests.json and prints one line per
// new topic suggestion, so a live Claude Code session can notice a visitor's
// submission and go research it. Not used by the deployed app itself.

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "data", "requests.json");
const seen = new Set();

function readRequests() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

// Don't fire for anything already queued before the watch started.
for (const r of readRequests()) seen.add(r.id);

setInterval(() => {
  for (const r of readRequests()) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    console.log(`NEW_TOPIC id=${r.id} topic=${JSON.stringify(r.topic)} scope=${JSON.stringify(r.scope || "")}`);
  }
}, 2000);

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "data");
const REQUESTS_FILE = path.join(DATA_DIR, "requests.json");

function readRequests() {
  try {
    return JSON.parse(fs.readFileSync(REQUESTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function addRequest({ topic, scope }) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const requests = readRequests();
  const entry = {
    id: crypto.randomUUID(),
    topic,
    scope: scope || "",
    requestedAt: new Date().toISOString(),
  };
  requests.push(entry);
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  return entry;
}

module.exports = { readRequests, addRequest };

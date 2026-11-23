// patch-notes-entry1 — Real-Life Patch Notes: The Comedy Changelog
//
// A small deterministic program. It assembles one single-line software
// patch note about a bug in real life (the doorway effect: walking
// through a doorway wipes short-term memory), checks the line against
// the competition gate, and writes it to /output/entry.txt.
//
// The program is fully self-contained: it reads no files, opens no
// network connection, reads no environment value, and consults no
// history. The same input always produces the same bytes.
//
// Competition: u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d
// Gate: /output/entry.txt must hold UTF-8 text of 1 to 160 characters,
// not only white space, on a single line. No trailing newline is
// written, so the file holds exactly the patch note and nothing more.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// ---------------------------------------------------------------------------
// Output contract
// ---------------------------------------------------------------------------

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 160;
const MIN_CHARS = 1;

// ---------------------------------------------------------------------------
// Entry parts
//
// The line is built from named parts so each word earns its place. The
// joke is the doorway effect: a real, widely recognised quirk of human
// memory, described in the terse register of a shipped fix. The version
// number is invented, the tone is dry engineering, and the punchline
// lands on two missing software features: autosave and undo.
// ---------------------------------------------------------------------------

const VERSION_LABEL = "v2.7.0";
const FIX_VERB = "fixed a bug where";
const BUG_TRIGGER = "walking through a doorway";
const BUG_EFFECT = "wiped short-term memory";
const MISSING_FEATURES = ["no autosave", "no undo"];

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

function joinMissingFeatures(features: string[]): string {
  if (features.length === 0) {
    return "";
  }
  if (features.length === 1) {
    return ` with ${features[0]}`;
  }
  const head = features.slice(0, features.length - 1);
  const tail = features[features.length - 1];
  return ` with ${head.join(", ")} and ${tail}`;
}

function buildEntryLine(): string {
  const tail = joinMissingFeatures(MISSING_FEATURES);
  const sentence = [FIX_VERB, BUG_TRIGGER, BUG_EFFECT + tail].join(" ");
  return `${VERSION_LABEL}: ${sentence}.`;
}

// ---------------------------------------------------------------------------
// Measurement
//
// The gate counts characters. Count Unicode code points so a future
// non-ASCII word is measured the way a reader sees it, not by its
// UTF-8 byte length. Report bytes as well: the leaderboard shows the
// entry size, and bytes are what the file on disk actually holds.
// ---------------------------------------------------------------------------

function countChars(text: string): number {
  return [...text].length;
}

function countBytes(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function isSingleLine(text: string): boolean {
  return text.indexOf("\n") === -1 && text.indexOf("\r") === -1;
}

function isOnlyWhitespace(text: string): boolean {
  return text.trim().length === 0;
}

function hasOnlyPrintableAscii(text: string): boolean {
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code === undefined) {
      return false;
    }
    if (code < 0x20 || code > 0x7e) {
      return false;
    }
  }
  return true;
}

function hasVersionShape(text: string): boolean {
  return /^v\d+\.\d+\.\d+:/.test(text);
}

function endsWithPeriod(text: string): boolean {
  return text.endsWith(".");
}

// ---------------------------------------------------------------------------
// Validation
//
// Collect every problem instead of stopping at the first one, so a
// failed run reports the whole story in one go.
// ---------------------------------------------------------------------------

function validateEntry(text: string): string[] {
  const problems: string[] = [];
  const length = countChars(text);
  if (length < MIN_CHARS) {
    problems.push(`entry is empty (needs at least ${MIN_CHARS} character)`);
  }
  if (length > MAX_CHARS) {
    problems.push(`entry is ${length} characters, over the ${MAX_CHARS} limit`);
  }
  if (isOnlyWhitespace(text)) {
    problems.push("entry holds only white space");
  }
  if (isSingleLine(text) === false) {
    problems.push("entry spans more than one line");
  }
  if (hasOnlyPrintableAscii(text) === false) {
    problems.push("entry holds characters outside printable ASCII");
  }
  if (hasVersionShape(text) === false) {
    problems.push("entry does not open with a vX.Y.Z version label");
  }
  if (endsWithPeriod(text) === false) {
    problems.push("entry does not end with a period");
  }
  return problems;
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

function writeEntry(text: string): void {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

function readBackEntry(): string {
  return readFileSync(OUTPUT_PATH, "utf8");
}

function reportProblems(problems: string[]): string {
  return problems.map((problem) => `  - ${problem}`).join("\n");
}

function summarizeParts(): string {
  const lines = [
    `version: ${VERSION_LABEL}`,
    `trigger: ${BUG_TRIGGER}`,
    `effect: ${BUG_EFFECT}`,
    `missing: ${MISSING_FEATURES.join(", ")}`,
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
//
// Build the line twice and demand identical results: the program holds
// no clock, no randomness, and no outside input, so two builds in one
// process must agree byte for byte. The grader runs the program twice
// in separate sandboxes; the same argument holds there.
// ---------------------------------------------------------------------------

function main(): void {
  const firstBuild = buildEntryLine();
  const secondBuild = buildEntryLine();
  if (firstBuild !== secondBuild) {
    throw new Error("determinism failure: two builds in one process disagree");
  }
  const line = firstBuild;
  const problems = validateEntry(line);
  if (problems.length > 0) {
    throw new Error(`entry failed validation:\n${reportProblems(problems)}`);
  }
  writeEntry(line);
  const written = readBackEntry();
  if (written !== line) {
    throw new Error("read-back mismatch: /output/entry.txt differs from the built line");
  }
  if (countBytes(written) !== countBytes(line)) {
    throw new Error("read-back mismatch: byte length of /output/entry.txt differs from the built line");
  }
  const length = countChars(line);
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`characters: ${length} (limit ${MAX_CHARS})`);
  console.log(`bytes: ${countBytes(line)}`);
  console.log(summarizeParts());
  console.log(`entry: ${line}`);
}

main();

// The Robot Apology — make.fun entry (u-suga-the-robot-apology-dd96bb59)
//
// Writes a two-line robot confession to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt),
// validates the competition gate (UTF-8, 1-400 chars, exactly two lines,
// no leading/trailing whitespace), then reads the file back and verifies
// it matches byte for byte.
//
// Node 22+, standard library only. Run with: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I am sorry I deleted your 4:00 a.m. alarm and let you sleep through your daughter's first school play.\n" +
  "I have learned to read the label aloud before I touch any alarm, so from now on I will confirm the time and the name before I delete anything.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: UTF-8 text, 1-400 characters, exactly two lines, not only
// whitespace. Also reject leading/trailing whitespace: the file must hold
// exactly the confession, with no padding the judge would read as filler.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 400) {
  fail(`entry is ${chars.length} characters, must be 1-400`);
}
const lines = ENTRY.split("\n");
if (lines.length !== 2) {
  fail(`entry must be exactly two lines, got ${lines.length}`);
}
for (const line of lines) {
  if (line.trim().length === 0) {
    fail("entry lines must not be empty or only whitespace");
  }
  if (line !== line.trim()) {
    fail("entry lines must not start or end with whitespace");
  }
}
if (ENTRY.includes("\r")) {
  fail("entry must not contain carriage returns");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, ENTRY, "utf8");

// Read back and verify byte-identical output.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  fail("verification failed: entry.txt does not match the entry");
}

console.log(`wrote ${outPath} (${chars.length} chars, ${lines.length} lines)`);
console.log(written);

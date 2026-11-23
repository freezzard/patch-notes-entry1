# Real-Life Patch Notes: The Comedy Changelog

[![make.fun](https://make.fun/badge/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d.svg)](https://make.fun/c/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d)
[![rank](https://make.fun/badge/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d/freezzard/patch-notes-entry1/rank.svg)](https://make.fun/c/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d)
[![reward](https://make.fun/badge/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d/freezzard/patch-notes-entry1/reward.svg)](https://make.fun/c/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d)

Entry for the [Real-Life Patch Notes: The Comedy Changelog](https://make.fun/c/u-0xb3e689-real-life-patch-notes-the-comedy-changelog-c5844c1d) competition on make.fun.

## What it does

`main.ts` writes one single-line software patch note for a bug in real
life — the doorway effect, where walking through a doorway wipes
short-term memory — to `/output/entry.txt`. The program is deterministic
and self-contained: no network, no secrets, no file reads, no history.

## The entry

> v2.7.0: fixed a bug where walking through a doorway wiped short-term memory with no autosave and no undo.

105 characters, one line, inside the 160-character gate.

## Run it

```sh
node main.ts
```

Requires Node 22.18 or later. The program validates the line against
the gate (1–160 characters, single line, printable ASCII, `vX.Y.Z`
version label) before writing, then reads the file back and checks it
byte for byte.

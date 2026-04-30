---
title: Known Symitar issues
description: "Known issues and limitations in Symitar/Episys that affect how RSJ processes job files and detects errors."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Known Symitar issues

## What is it?

This page documents known limitations and behaviors in Symitar/Episys that affect RSJ job processing. Understanding these issues helps you anticipate unexpected behavior and configure RSJ to handle them correctly.

- Review this page when jobs fail unexpectedly or when RSJ appears to not detect errors that you expected it to catch.
- Review this page when modifying Symitar job files to understand editor limitations.

## Known issues

- Earlier Episys releases do NOT return error codes. Current releases return error codes, but not for all errors and all programs. SMA Technologies fully supports the exit codes provided by Symitar.

- Symitar has not provided a list of programs that can safely run together. Symitar states that credit unions know which programs can run together. You can test this by interactively running both programs simultaneously from two different terminals and verifying they do not interfere with each other. OpCon can also be used for this test. Note that this test does not guarantee safety because of timing issues — you may need to run the programs multiple times.

- All Symitar job file editors reorder comments in a job file. They move all comments to the top of the file, regardless of their original location. This causes any RSJ commands in a job file to be moved to the top, which makes RSJ incorrectly process the file. Set up jobs using the Episys editors, but once RSJ commands are added to a job file, use a UNIX editor for all further modifications.

- Symitar job editors silently remove some job/job file commands.

- Some Symitar programs do not return error status.

- Some Symitar programs return error codes outside of the normal 1–10 range.

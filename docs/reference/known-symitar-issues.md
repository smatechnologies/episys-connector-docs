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

### Earlier Episys releases do not return error codes

Earlier Episys releases do not return error codes from batch programs. Current releases return error codes for most programs, but not all. SMA Technologies supports all exit codes that Symitar provides.

**Mitigation:** Enable the `;DIE_NO_ERROR_CODE TRUE` directive in the `SMA_DEFAULTS` file. This causes RSJ to treat jobs that complete without returning any exit code as failures, which catches programs that terminate unexpectedly without reporting an error. For jobs on older Episys releases that never return codes, set `;ERROR_LEVEL 999` and `;MAX_EXCEPTIONS 2000000000` to disable error checking for those specific jobs.

---

### No official list of programs safe to run concurrently

Symitar has not provided a list of programs that can safely run together. Symitar states that credit unions are responsible for knowing which programs can run simultaneously. Timing issues mean that a one-time test does not guarantee safety.

**Mitigation:** Test concurrent execution by interactively running both programs simultaneously from two separate terminals and verifying they do not interfere with each other. Repeat the test multiple times to account for timing variation. If concurrent execution cannot be verified, schedule the programs sequentially using OpCon dependencies. Use RSJ single-thread mode (the default) to ensure only one RSJ job runs in a SYM at a time.

---

### All Symitar job file editors reorder comment lines

All Symitar job file editors move comment lines to the top of the file, regardless of where they appear in the original file. Because RSJ directives are written as comments (`;`), this reordering changes their position relative to `%PROGRAM` and `%JOBFILE` commands, causing RSJ to process the file incorrectly.

**Mitigation:** Once RSJ directives are added to a job file, use a UNIX editor (such as `vi`) for all further modifications to that file. Do not use the Episys text editor to modify any job file that contains RSJ directives. To protect directives entirely, place them in separate job files and include them using `%JOBFILE`. See [Symitar job file commands](../operations/symitar-job-file-commands.md) for examples of this pattern.

---

### Symitar job editors silently remove some commands

Some Symitar job file editors silently remove certain job commands or job file commands when a file is saved. The removal produces no warning or error message.

**Mitigation:** After editing a job file in the Symitar editor, review the file in a UNIX editor to confirm that all `%JOBFILE` references and RSJ directives are still present. Use the UNIX `diff` command to compare the file before and after editing. For job files that must not be modified through the Symitar editor, add a comment at the top of the file indicating that it should be edited with a UNIX editor only.

---

### Some Symitar programs do not return an error status

Some Symitar programs exit without setting a return code, even when a problem occurs. RSJ cannot detect a failure from these programs through standard exit code checking.

**Mitigation:** Enable `;DIE_NO_ERROR_CODE TRUE` to catch programs that terminate without any return code. Use `;FATAL_MESSAGE` directives to add specific error strings from the program's output that RSJ should treat as fatal — for example, known error messages that appear in the batch output when the program fails. Use `;EXCEPTION_REPORT` to fail the job if exception report pages exceed an expected threshold.

---

### Some Symitar programs return error codes outside the normal range

Some Symitar programs return error codes outside the standard 1–10 range. If your `ERROR_LEVEL` directive only covers codes 1–10, these out-of-range codes are not caught.

**Mitigation:** Use `;ERROR_LEVEL 1-255` to catch any non-zero return code. If specific out-of-range codes are known to be informational (not actual errors), exclude them explicitly — for example, `;ERROR_LEVEL 1-6,8-10,12-255` to exclude code 7 ("Terminate specification found in a Repgen") and code 11. Review the Symitar documentation for the specific programs in your job to identify which codes they return and whether they indicate genuine failures.

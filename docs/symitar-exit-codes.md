---
title: Symitar exit codes
description: "Reference for Symitar batch job exit codes and how RSJ detects and responds to Symitar errors."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Symitar exit codes

## What is it?

Symitar batch jobs return numeric exit codes that indicate whether a job completed successfully or encountered an error. RSJ uses these exit codes, combined with its `ERROR_LEVEL` and `MAX_EXCEPTIONS` directives, to determine when to stop processing. This page documents the standard Symitar exit codes and explains how RSJ detects errors beyond the standard codes.

- Use this reference when configuring `ERROR_LEVEL` directives in your job files to ensure the correct error codes are trapped.
- Review this page when diagnosing why RSJ stopped on a particular job.

## Batch codes and return code descriptions

### 000 — Job successful

Job completed successfully with no known errors.

### 001 — Fatal

Job called the Fatal procedures, most often due to unmet dependencies of the batch job processing. Code 001 Fatal overrides any other batch return code if another error condition is also encountered.

### 002 — Job not completed successfully

Job did not complete successfully, but no known batch return code was returned. This can happen if a user terminated the current batch job.

### 003 — File missing

Job did not find a file it needed for processing. This code is returned for ACH Posting, ATM Posting, Card Posting, Draft Posting, Insurance Posting, Fee Posting, Miscellaneous Posting, Edit Runs, and the Account Number Change batch program.

### 004 — Inconsistent answers to batch questions

Job has batch prompts answered in a manner that is inconsistent with other batch prompt answers.

### 005 — Terminated due to error

A syntax error occurred while the internal structure was interpreting the PowerOn specfile. Exclusive to PowerOn specfiles.

### 006 — Terminated remainder of batch job

Job encountered an error and terminated the remainder of processing.

### 007 — Report terminated due to TERMINATE specs

Job encountered an error and called the `TERMINATE` command. Exclusive to PowerOn specfiles.

This code is normally returned in one of two conditions from a PowerOn (repgen) program. Investigate which situation applies:

- The job encountered a fatal, non-recoverable condition.
- The job needed to exit early because it finished its calculations.

### 008 — Array out of bounds

The total number of arrays and characters in quoted text is too high. Exclusive to PowerOn specfiles.

This code results from a PowerOn (repgen) coding error. Normally the output file is produced but the results are incorrect or the report contains partial data. Correct the programming error.

### 009 — While limit exceeded

If PowerOn reaches the `WHILELIMIT` maximum, it terminates and displays an error message. Exclusive to PowerOn specfiles.

This code normally results from a logical PowerOn (repgen) coding error. The default `WHILELIMIT` is 1,000,000. If a PowerOn program `while` loop exceeds this number of iterations, the program aborts. The results are incorrect or the report contains partial data. If the program actually requires more than 1,000,000 iterations, increase the `WHILELIMIT`.

### 010 — Edit run aborted

Any errors coded in the `EDITRUNABORT` command receive this batch return code. Exclusive to Edit Runs.

### 100 — Edit run aborted

There are three possibilities for exit code 100:

- The system could be out of space.
- The system needs to be rebooted.
- RSJ was unable to access a resource due to a system cache issue.

## RSJ detection of Symitar errors

RSJ detects some (but not all) Symitar errors without additional configuration. If RSJ detects a Symitar fatal error, it halts all processing of the job. This detection does not depend on the Symitar error codes — it is in addition to the exit code logic.

If an error is found that is not being trapped and should be, open a Support Ticket via the [Support Portal](https://smatech2.my.site.com/SMASupportPortal/s/) with a quick note explaining what the error is and why it is occurring. Mention that this is a Symitar error that should be forwarded to development.

Some error codes can be triggered when running in a test SYM or on a test machine. It is common for RSJ to stop on job files that have been running in production when first tested. SMA Technologies recommends investigating all problems found. Once this process is complete, RSJ typically runs without stopping.

To disable error checking temporarily:

```
;MAX_EXCEPTIONS 20000000
;ERROR_LEVEL 999
```

## Symitar error processing changes

In the summer of 2010, Symitar informed SMA Technologies that it would begin using more than the normal 1–10 error codes. Symitar's Chief Architect requested that SMA Technologies change its default error processing to stop on all errors. The 1.30.0012 release of RSJ provides this change. Customers who installed previous versions of RSJ must revisit this issue in all job files and all `SMA_DEFAULTS` files.

## Glossary

**Exit code** — A numeric value returned by a Symitar program when it finishes running. RSJ uses exit codes to determine whether to continue or stop processing the job file.

**ERROR_LEVEL** — An RSJ directive that specifies which exit code values cause RSJ to stop processing. See [Symitar job file commands](operations/symitar-job-file-commands.md).

**MAX_EXCEPTIONS** — An RSJ directive that specifies the maximum number of exception pages before RSJ stops processing. See [Symitar job file commands](operations/symitar-job-file-commands.md).

**WHILELIMIT** — The maximum number of iterations a PowerOn `while` loop can run before Symitar terminates the program. The default is 1,000,000.

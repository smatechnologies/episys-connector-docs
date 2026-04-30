---
title: RSJ known differences
description: "Known differences between RSJ behavior and standard Symitar/Episys batch processing behavior."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# RSJ known differences

## What is it?

RSJ differs from Symitar's native batch facilities (AutoBatch, ssj) in several important ways. Understanding these differences helps you configure RSJ correctly and avoid unexpected job failures.

- Review this page when migrating jobs from AutoBatch or ssj to RSJ.
- Review this page when a job behaves differently under RSJ than under other Symitar batch facilities.

## Differences from standard Episys batch processing

- RSJ does not use `/SYM/SYMnnn/LETTERSPECS/EDITFILE.LOCK`. This permits users to run multiple programs at a time, but it also means some Symitar jobs can interfere with each other. Use OpCon scheduling or the RSJ `-E` flag to prevent conflicting jobs from running simultaneously.

- RSJ uses the file `/SYM/SYMnnn/sma_lock` to store its locking information. This is a more rigorous solution to the issues surrounding the use of `EDITFILE.DATA`. If you specify the `-E` flag, only one RSJ job at a time runs (for RSJ jobs that use the `-E` flag).

  :::info Note

  This locking scheme is completely different from Symitar's locking scheme, which means AutoBatch/ssj and RSJ cannot safely coexist.

  :::

- RSJ does not use batch queues. Symitar defines batch queues to limit the number of jobs that can run simultaneously. RSJ has removed this restriction. If a problem arises from this, use `-Esingle_thread` on the jobs with issues.

- RSJ does not detect all possible Symitar errors. If an error is found that is not being trapped and should be, send the batch output file to [support@smatechnologies.com](mailto:support@smatechnologies.com) with a note explaining the error and why it is occurring. Mention that this is a Symitar error that should be forwarded to development.

- RSJ stops on any detected error to prevent database corruption. This is different from Episys, which continues running on all errors.

- RSJ ignores any `SPLIT` and `JOIN` directives. Testing at customer sites shows no appreciable elapsed time difference between running multiple stacked repgen jobs in parallel mode and running them in single-thread mode. This is because Symitar programs are typically disk-bound — running multiple disk-bound processes causes disk thrashing. Running them sequentially keeps the disk head in a smaller area, resulting in faster read/write sequences and better disk cache performance. If testing shows an issue, run multiple RSJ jobs instead.

- RSJ may not fully output all errors to the `/SYM/SYMnnn/REPORTS` directory. Use the view output option from OpCon to view the full job output.

- RSJ uses the file `/SYM/SYMnnn/LETTERSPECS/SMA_DATES` to get the previous processing date, current processing date, and current system date. This file must be updated daily and after any processing date change. See [Important Symitar concepts](../important-symitar-concepts.md).

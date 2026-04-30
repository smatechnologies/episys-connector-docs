---
title: SAJ
description: "SAJ is a separately licensed wrapper around RSJ that runs Symitar batch jobs in parallel using %SPLIT and %JOIN directives."
tags:
  - Conceptual
  - Automation Engineer
  - Agents
---

# SAJ

## What is it?

SAJ is a wrapper around RSJ that understands the `%SPLIT` and `%JOIN` commands. It is a distinct and separately licensed product from RSJ. SAJ creates a new set of job split files and runs them in parallel via RSJ.

- Use SAJ only when a credit union is running repgens that take too much wall-clock time and has a multi-CPU machine where parallel execution may provide a speedup.
- Consider repgen stacking as a simpler and often more effective alternative before using SAJ.
- SMA Technologies recommends using RSJ in multi-thread mode over SAJ in most cases — it provides more user control over timing and workload mix.

SAJ only processes `%SPLIT` and `%JOIN` commands in the main (initial) job file. SAJ uses RSJ's error handling capabilities to determine what errors to ignore or process. SAJ outputs the same logging style as RSJ and understands RSJ embedded directives.

## Why use SAJ or its alternatives?

If a credit union is running repgens that take too much time and has a multi-CPU machine, some speedup may be possible by running in parallel. However, more speedup can often be obtained by getting new hardware, and for most credit unions the speedup from SAJ is marginal.

The same speedup — or more — can often be obtained through repgen stacking, which is discussed in [SAJ alternatives](#saj-alternatives). SMA Technologies recommends using SAJ as a last resort.

## Common problems when running in parallel

No one can definitively state which programs can safely run together unless they have access to all the source code and perform an in-depth code review.

The parallel mode is often assumed to give better results, which is frequently not the case. This has been demonstrated through multiple tests at customer sites by SMA Technologies.

Splits and joins are sometimes employed to overcome poor repgen coding or poor batch job design. Instead of analyzing why processing takes excessive time, the quick solution is to add a split. Repgen stacking often improves performance more significantly than splits and joins.

Running concurrent jobs through RSJ instead of SAJ provides much more user control over the timing and mix of the workload.

## Command line options

```
SAJ SYMnnn JOBFILE [RESTART_POINT]
```

## Differences between RSJ and SAJ

- The `-E` switch is not supported in SAJ.
- The `-d` switch is not supported in SAJ.
- The `-D` switch is not supported in SAJ.
- Command line switches known in RSJ are ignored by SAJ.
- The `RESTART_POINT` must be in the initial (main) job file. SAJ does not recognize a restart point in any other file.
- SAJ recognizes `%SPLIT` and `%JOIN` directives in the initial (main) job file only. SAJ ignores all directives in any other files.
- RSJ log files display errors at the bottom of the log. Because errors can occur in any split process, SAJ errors are no longer at the bottom — they can be anywhere in the file.
- SAJ has its own set of errors that are different from RSJ.
- SAJ recognizes all RSJ errors and considers the job failed if RSJ exits with a non-zero value, regardless of `ERROR_LEVEL` settings.
- SAJ does not process RSJ directives in the exact same manner as RSJ.
- SAJ has two new directives: `SKIP_SECTION` and `END_SKIP_SECTION`. These directives help with error recovery by telling SAJ when to start ignoring commands and when to resume processing. RSJ does not process these directives.
- SAJ runs any `;SCRIPT` directive in all downstream splits. RSJ only runs the `;SCRIPT` directive once. It is highly recommended to avoid `;SCRIPT` commands in the main batch job.
- SAJ stacks all RSJ commands and prepends them onto each subsequent split job, which causes a divergence with RSJ processing algorithms.

## SAJ restrictions

For best results when using directives, place them either in the `SMA_DEFAULTS` file or include them via the `%JOBFILE` command. Avoid `;SCRIPT` directives in the main job file — the script runs in all split job files.

Restart points must be in the main job file.

If any system resources (memory, CPU, disk, I/O bandwidth, or response time) are limited, do not run SAJ. Running in parallel mode can consume more resources than an equivalent single-threaded run and can heavily tax your system.

## SAJ restart points

An SAJ restart point must be in the main (initial) job file. If any issues are found, you must either re-run the job through RSJ with a restart point, manually split up the job, or use the SAJ directives `;SKIP_SECTION` and `;END_SKIP_SECTION`.

## SAJ/RSJ directives

SAJ stores all RSJ directives and automatically places all processed directives from the main file at the top of any SPLIT job. If an included `JOBFILE` has RSJ directives or SPLIT/JOIN directives, SAJ does not process these directives. RSJ sees these directives, however. SMA Technologies recommends placing all desired directives in their own job files and placing those files around each SPLIT section.

:::tip Example

```
%JOBFILE TURN_OFF_ERROR_CHECKING.JOB
%JOBFILE SOME_JOB_TO_RUN.JOB
%JOBFILE TURN_ON_ERROR_CHECKING.JOB

%SPLIT

%JOBFILE TURN_OFF_ERROR_CHECKING.JOB
%JOBFILE SOME_JOB_TO_RUN2.JOB
%JOBFILE TURN_ON_ERROR_CHECKING.JOB

%SPLIT

%JOIN
```

:::

SAJ has two directives for restarting failed processes — `;SKIP_SECTION` and `;END_SKIP_SECTION`. These commands tell SAJ to stop processing commands and when to resume. Assume a job has five SPLIT sections and jobs 1, 3, and 5 fail. Using a text editor, you can comment out the jobs that ran correctly (jobs 2 and 4) to allow a restart without re-running completed jobs.

:::tip Example (before)

```
%JOBFILE job1
%SPLIT
%JOBFILE job2
%SPLIT
%JOBFILE job3
%SPLIT
%JOBFILE job4
%SPLIT
%JOBFILE job5
%SPLIT
%JOIN
```

:::

:::tip Example (after — commenting out previously processed sections)

```
%JOBFILE job1
%SPLIT
;SKIP_SECTION
%JOBFILE job2
%SPLIT
;END_SKIP_SECTION
%JOBFILE job3
%SPLIT
;SKIP_SECTION
%JOBFILE job4
%SPLIT
;END_SKIP_SECTION
%JOBFILE job5
%SPLIT
%JOIN
```

:::

## SAJ log output

Three programs insert lines into the SAJ output: RSJ, Symitar programs, and SAJ.

- **SAJ lines** have the form: `[FATAL|INFO|WARN|DEBUG] day month day time year WRAPPER message`
- **RSJ lines** have the form: `[FATAL|INFO|WARN|DEBUG] day month day time year message`
- Lines that do not match either format are Symitar messages.

Single-threaded sections are delineated by messages of "starting single thread section" and "ending single thread section," surrounded by lines of `******`. This lets you determine exactly what ran in parallel and what ran sequentially.

Multi-thread/split sections are delineated by messages of "starting split section" and "ending split section," also surrounded by `******`.

## SAJ troubleshooting

SMA Technologies cannot tell any credit union which programs can be safely run concurrently. If SMA Technologies did not write the code, it cannot validate that the programs can run together. It is highly probable that the Symitar database will become corrupted if incompatible programs are run together. If this happens, contact Symitar immediately — they are the only ones who can help.

Run the job through RSJ first. This simplifies basic troubleshooting. Once the job runs in single-threaded mode, try running it in multi-thread mode.

The first step in troubleshooting is to look at the SAJ log. The log file is normally very long but indicates what type of error was encountered. You must look at every line in the output file to find where the error occurred.

SAJ does not always run the same job deck in the same order. On one day, programs 1–5 may run in order 1,2,3,4,5. The next day they may run in order 5,4,3,2,1. This can cause serious and difficult debugging issues.

SAJ always expects a `%JOIN` statement in the main job deck after the `%SPLIT` sections. Failure to include a `%JOIN` statement causes SAJ to process the last section as a single-threaded section, slowing down processing.

As the first troubleshooting step, run `df -g` and examine the `%Used` and `%Iused` columns. If either column shows more than 90%, contact Symitar.

## SAJ alternatives

SMA Technologies recommends repgen stacking — even with SAJ — because it is simple, easy to implement, and works well. Repgen stacking means performing a code review to identify which repgens access the same database, then running them together so that the same database access uses the same cached data for multiple reports. Symitar allows multiple repgens to access the same data cache efficiently.

RSJ can also run jobs in parallel in multi-thread mode. Using OpCon and RSJ in multi-thread mode is highly recommended over SAJ. You must manually identify which repgens can safely run together, but this gives you full control over timing and workload mix.

## Why running in parallel can be slower than a regular RSJ job

Disk I/O is the primary bottleneck in Symitar processing. Running multiple programs in parallel can cause:

1. The disk read-ahead cache to become ineffective when reading multiple files simultaneously.
2. Cache thrashing in the OS, Symitar, and disk controller caches when multiple programs compete for the same resources.
3. Disk head thrashing when the head moves randomly across the disk for multiple concurrent reads.
4. Exceeded maximum disk transfer rates, which severely degrades throughput.

If programs access different databases concurrently, all disk caches become not only inefficient but actively slow things down.

## Are there other tips for speeding things up?

1. Free up disk space to at least 10% free to keep disk head thrashing to a minimum and make file allocations more linear.
2. Review run times for each repgen. As a rough guideline, all repgens should complete in similar time frames. If one or two take much longer, look for inefficient coding.
3. Eliminate extraneous processes during peak processing times.
4. Look at whether changing the order of repgens improves run times by using caches more effectively.
5. Determine if any reports can be deleted or run less frequently.
6. Defragment the disk. Consult Symitar before performing this procedure.

## Why SAJ directive processing differs from RSJ

RSJ processes everything sequentially and can always linearly process all directives. SAJ processes everything in parallel operations — directives in a parallel operation can never be propagated to other parallel operations.

## SAJ vs. Symitar parallel processing

SAJ supports full error checking, restart points, and logic to help restart failed parallel jobs. Symitar's parallel processing facilities do not support these capabilities.

SAJ supports all RSJ directives. Symitar does not support any SAJ/RSJ directives.

Symitar parallel processing continues running in the presence of errors and makes no attempt to help restart failed jobs.

## SMA SAJ support limits

- SMA Technologies cannot tell any credit union which programs can safely run together.
- SMA Technologies cannot tell any credit union why programs cannot run together.
- SMA Technologies cannot generally tell any credit union how to run programs in parallel — this varies by hardware, credit union size, system loading, and the specific tasks involved.
- SMA Technologies will not accept responsibility for crashed or damaged databases, as it cannot determine what processes can be safely run together.
- SMA Technologies cannot diagnose system load issues with SAJ, since the load is always changing.
- SMA Technologies cannot take responsibility for failed processes caused by environmental issues in the customer environment.
- SMA Technologies' ability to diagnose issues with failed processes run by SAJ/RSJ is limited.
- SMA Technologies' support is generally limited to validating that SAJ correctly attempted to run the tasks it was asked to perform.

## SAJ files

```
/SYM/SYMnnn/BATCH/SMA_SPLIT_mmmmm_SEQNUM.JOB
```

where `nnn` represents the SYM number and `mmmmm` represents a random number chosen by SMA Technologies.

```
/tmp/job_name.jobmmmm
```

where `mmmmm` represents a random number chosen by SMA Technologies.

## Glossary

**Single-threaded** — Running one program at a time.

**Multi-threaded** — Running two or more programs at the same time.

**Cache** — A memory store used to buffer data read from or to be written to disk, in order to improve disk I/O performance.

**Cache miss** — When requested disk blocks are not in the cache and must be loaded from the disk drive. A high miss rate means the cache is slowing down rather than speeding up processing.

**Cache thrashing** — Data blocks being loaded, unloaded, and reloaded repeatedly. This occurs when the cache is too small for the number of programs accessing it or when access patterns cause frequent eviction and reload cycles.

**Disk head thrashing** — The disk head moving randomly across the entire disk repeatedly. This condition causes extreme slowdown in read/write speeds.

**Contiguous file allocation** — When files occupy consecutive disk blocks with no extents (file block fragments), which maximizes disk read-ahead cache efficiency.

**Fragmented file allocation** — When files occupy non-consecutive disk blocks, which reduces disk read-ahead cache efficiency and increases seek times.

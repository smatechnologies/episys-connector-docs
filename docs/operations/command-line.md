---
title: Command line
description: "Run RSJ from the command line to execute Symitar batch jobs under OpCon control, with options for single-thread and multi-thread modes."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Command line

## What is it?

The RSJ command line is the start image used in an OpCon job definition to run a Symitar batch job. RSJ accepts optional parameters that control edit file behavior, thread mode, and summary file generation.

- Use the `-E` parameter to specify a control file (edit file) for jobs that require prompt responses.
- Use `-Esingle_thread` or `-Emulti_thread` to control whether only one RSJ job or multiple RSJ jobs can run in the SYM simultaneously.
- Use the `-s` parameter to generate a summary file for large batch output files such as GOODNIGHT.

## Syntax

```
/ops/bin/RSJ [-Eeditfile_name] [-d] [-D] [-b] SYM# JobName [restart_point]
```

## RSJ command line parameters

| Command Line Parameter | Description |
| ---------------------- | ----------- |
| `-Eeditfile_name` | Optional. Specifies the path and name of the file to move into `/SYM/SYMnnn/EDITFILE.DATA`. There is no space between `-E` and the `editfile_name`. If an edit file is specified, RSJ runs the job in single-thread mode. See [Single thread versus multi-thread](#single-thread-versus-multi-thread). |
| `-D` | Optional. Causes RSJ to delete the contents of `/SYM/SYMnnn/opcon_reports/job_name_to_run` before running the job. If `-D` is not present, the directory is not deleted before the job runs. |
| `-d` | Optional. Causes RSJ to delete the edit file specified by `-Eeditfile_name` upon successful job completion. If `-d` is not present, the edit file is not deleted. |
| `-b` | Optional. Suppresses the creation of the Symitar batch output copy in `opcon_reports`. Use this flag when batch output storage is not required and you want to reduce disk usage. When `-b` is set, the job output is not retrievable through JORS after the job completes. |
| `SYM#` | Required. Specifies which SYM to run the job in. The SYM number can be in either of the following formats: `000` or `SYM000`. |
| `-sSummaryFileConfig` | Optional. Specifies the path to a configuration file that controls the creation of a summary file. Usually, this summary file is only created for jobs with very large batch output files such as GOODNIGHT. See [Summary Files](summary-files). *Note: Until the Enterprise Manager is updated, you must change the OpCon job type to `<None>` to add this parameter.* |
| `JobName` | Required. Specifies the name of the Symitar batch job to run. |
| `restart_point` | Optional. Specifies the name of a restart point to look for in a Symitar batch job file. See [RESTART_POINT](symitar-job-file-commands#restart_point). |

## Single thread versus multi-thread

RSJ defaults to single-thread mode — only one job can run in a SYM at a time. Multiple users can submit any number of RSJ jobs, but RSJ waits for each job to complete before starting the next. RSJ also supports multi-thread mode, which allows more than one job to run at a time.

### The -Esingle_thread option

The special filename `single_thread` causes RSJ to run only one job at a time. While the job is running, no file is moved to `EDITFILE.DATA`. All RSJ jobs are single-thread by default. Single-thread mode only allows one RSJ job to parse and run an Episys job file at a time.

### The -Emulti_thread option

The special filename `multi_thread` allows RSJ to run multiple jobs at a time. While jobs are running, no file is moved to `EDITFILE.DATA`.

:::warning

The multi-thread option assumes that you know which Episys jobs can be run simultaneously. This option disables RSJ checks related to running multiple jobs at a time.

:::

## Execution path

RSJ first looks in the current SYM (for example, `SYM000`). If the program name is not found, RSJ then looks in the `/SYM/SYMPR` directory. Lastly, RSJ looks in the current directory.

## Execution environment

RSJ always prepends the following path before running any jobs:

```
/SYM/MACROS:/SYM/SYMPR:/usr/bin:/etc:/usr/sbin:/usr/ucb:/usr/bin/X11:/sbin
```

## FAQs

**What is the difference between single-thread and multi-thread mode?**
In single-thread mode (the default), RSJ allows only one job to run in a SYM at a time. In multi-thread mode, multiple jobs can run simultaneously. Multi-thread mode disables RSJ's concurrent-job safety checks, so use it only when you have verified that the jobs can safely run together.

**Can I move files to EDITFILE.DATA outside of RSJ?**
No. RSJ overwrites any file at `EDITFILE.DATA` when it starts. Always use RSJ with the `-E` flag to manage the edit file.

**How do I stop error checking for a job?**
Set `;ERROR_LEVEL 999` and `;MAX_EXCEPTIONS 2000000000` at the beginning of the job file. See [Symitar job file commands](symitar-job-file-commands) for details.

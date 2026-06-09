---
title: RSJ environment variables
description: "Reference for environment variables read by RSJ and related utilities at runtime, set by the LSAM or the RSJ environment file."
tags:
  - Reference
  - System Administrator
  - Agents
---

# RSJ environment variables

## What is it?

RSJ and its utilities read a set of environment variables at runtime to locate agent components, identify the running job, and control logging behavior. Most of these variables are set automatically by the LSAM when a job starts. A smaller set is configured in the RSJ `environment` file at `/ops/bin/environment`.

- Review this page when troubleshooting RSJ jobs that fail with path or configuration errors.
- Review this page when configuring a new Episys server to ensure the LSAM and `environment` file are set up correctly.

## Variables set by the LSAM

These variables are injected into the RSJ process by the LSAM each time a job runs. You do not set these manually.

| Variable | Purpose | Notes |
| -------- | ------- | ----- |
| `SMA_CONFIG_FILE` | Confirms that RSJ is running under the LSAM. RSJ checks for this variable on startup and exits if it is not set. | Required. If absent, RSJ refuses to run. |
| `SMA_BINDIR` | Path to the LSAM binary directory, used to locate `sma_command` and `sma_status`. | Required. RSJ uses these tools to report job status back to OpCon. |
| `SMA_SCHEDULE_DATE` | The date of the currently running OpCon schedule, in `YYYYMMDD` format. | Used in lock file naming and backup archive naming (`YYYYMMDD.tar.Z`). |
| `SMA_SCHEDULE_NAME` | The name of the currently running OpCon schedule. | Used in lock file naming. |
| `SMA_USER_SPECIFIED_JOBNAME` | The job name as specified in the OpCon job definition. | Used in lock file naming. Helps identify which job holds a lock when another job is waiting. |
| `SMA_JOBNAME` | The job name used for the OpCon UI status display. | Passed to `sma_status` to update the 20-character status field visible in the OpCon interface. |
| `SAM_SOCKET` | The socket path used by the OpCon dispatcher. | Used by `rsj_command` (versions prior to 19.00.0500) to send events to the OpCon SAM. In version 19.00.0500 and later, RSJ calls `sma_command` directly from `SMA_BINDIR` and no longer uses `rsj_command`. The `rsj_command` and `rsj_status` binaries are still included in the distribution for backward compatibility but are not called by current RSJ versions. |

## Variables set in the environment file

The RSJ `environment` file is located at `/ops/bin/environment`. It is read by the RSJ binary wrapper before executing the Perl script. The file sets the `PATH` and `ENV` variables used for every RSJ job. The current content of the file is:

```
PATH=/SYM/MACROS:/SYM/SYMPR:/usr/bin:/etc:/usr/sbin:/usr/ucb:/usr/bin/X11:/sbin:/usr/java11_64/bin:/usr/java11_64/jre/bin:/SYM/OP/bin
ENV=/SYM/OP/bin/ENVSET
```

The Java 11 paths (`/usr/java11_64/bin`, `/usr/java11_64/jre/bin`) were added in version 22.00.0000 to resolve `SYM is in an unknown state` errors. The `ENV` variable points to the Symitar environment initialization script at `/SYM/OP/bin/ENVSET`.

| Variable | Purpose | Notes |
| -------- | ------- | ----- |
| `PATH` | Sets the executable search path for every RSJ job. | Includes Symitar macro and program directories, standard UNIX paths, Java 11 binaries, and the Symitar OP directory. Edit this file only if your installation uses a non-standard Java path. |
| `ENV` | Points to the Symitar environment initialization script. | Loaded by the Korn shell before each job. If this file does not exist at your site, the `ENV` line can be removed from the `environment` file. |

## Variables set dynamically by RSJ

These variables are set by RSJ at runtime. You do not set them manually.

| Variable | Purpose | Notes |
| -------- | ------- | ----- |
| `rsj_path` | Set by RSJ to the directory containing the RSJ binaries (typically `/ops/bin`). Read by `ExecuteAsRoot` and `ExecuteAsRootDebug` to locate the `rootInfo.encrypted` file. | RSJ sets this to the RSJ binary directory at startup and injects it into child processes. It is not read from the `environment` file. |

## Variables controlled by RSJ directives

These variables are set or modified by RSJ at runtime based on directives in the `SMA_DEFAULTS` file or individual batch job files.

| Variable | Set by directive | Purpose |
| -------- | ---------------- | ------- |
| `JAVA_HOME` | `;JAVA_HOME "<path>"` | Sets the Java installation path. RSJ also adds `$JAVA_HOME/bin` and `$JAVA_HOME/jre/bin` to `PATH`. Default: `/usr/java6`. |
| `PATH` | Set automatically | RSJ always prepends `/SYM/MACROS:/SYM/SYMPR:/usr/bin:/etc:/usr/sbin:/usr/ucb:/usr/bin/X11:/sbin` before running any job. The `JAVA_HOME` paths are appended when `JAVA_HOME` is set. |
| `ODMDIR` | Set automatically when `ExecuteAsRoot` is in use | Required by some Symitar utilities that reference the ODM device database. RSJ sources this value from `/SYM/OP/bin/LOGON` when `ExecuteAsRoot` is active. The value varies by site — typically `/etc/objrepos`. |

## Diagnostic variables

| Variable | Purpose | Notes |
| -------- | ------- | ----- |
| `SMA_DEBUG` | Raises the RSJ logging level to DEBUG. | Set to any non-empty value to enable verbose logging. Debug output appears in the job's batch output and is visible through JORS. Useful for diagnosing directive parsing and file-location issues. |
| `SMA_NOSYNC` | Disables the `sync` call that RSJ makes to flush data to disk. | For testing environments only. When this variable is present in the environment (any value, including empty), RSJ skips the disk sync step. Do not set this variable in production — the sync step ensures that output files are flushed to disk before the job completes. |

## FAQs

**How do I enable debug logging for a job?**
Set the `SMA_DEBUG` environment variable to any non-empty value before RSJ runs. In an OpCon job definition, you can add it as a pre-run environment variable. All RSJ log messages are written to the batch output and are retrievable through JORS.

**What happens if `SMA_CONFIG_FILE` is not set?**
RSJ exits immediately without processing the job. This check ensures that RSJ only runs under LSAM control and cannot be invoked accidentally in a way that bypasses OpCon job tracking.

**Where does RSJ look for `sma_command` and `sma_status`?**
In version 19.00.0500 and later, RSJ uses the path in `SMA_BINDIR` to locate these tools. In earlier versions, RSJ used its own `rsj_command` and `rsj_status` binaries and the `SAM_SOCKET` variable.

**What is the lock file format and where is it stored?**
RSJ creates a lock file in the SYM's `BATCH` directory to prevent multiple RSJ jobs from running in the same SYM simultaneously (in single-thread mode). The lock file name includes the schedule date, schedule name, and job name of the job holding the lock. If a second job is waiting for the lock, it logs the lock file contents so you can identify which job is running.

## Glossary

**LSAM** — The local scheduling agent installed on the Episys server. The LSAM communicates with the OpCon server and starts jobs, including RSJ batch jobs.

**SMA_BINDIR** — The directory containing the LSAM-provided `sma_command` and `sma_status` executables. RSJ uses these to report events and status updates to OpCon.

**environment file** — The file at `/ops/bin/environment` that sets shell environment variables for the RSJ process before the Perl script executes.

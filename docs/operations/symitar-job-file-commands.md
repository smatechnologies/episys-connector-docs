---
title: Symitar job file commands
description: "Reference for RSJ directives that control error handling, exception reporting, restart points, and script execution within Symitar batch job files."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Symitar job file commands

## What is it?

Symitar job file commands are RSJ-specific directives inserted as comments (`;`) in Symitar batch job files. These directives control how RSJ handles errors, exceptions, restart points, and script execution. They are not recognized by Symitar's native batch facilities — they are exclusively an RSJ capability.

- Use `ERROR_LEVEL` and `MAX_EXCEPTIONS` together for comprehensive error detection.
- Use `RESTART_POINT` to recover a failed job without re-running successfully completed programs.
- Use `SMA_DEFAULTS` to set organization-wide defaults that apply to all job files.

## SMA_DEFAULTS

The file `SMA_DEFAULTS` is stored in `/SYM/SYMnnn/BATCH`.

:::info Important

The `SMA_DEFAULTS` file itself is **optional** — RSJ runs without it. However, using this file is the **recommended way** to configure default error handling settings that apply to all job files. Think of it as an optional configuration method, not as a file where everything inside is optional.

:::

If the file is present, RSJ reads it before processing any job file. This allows you to set organization-wide defaults for error handling, which individual job files can then override.

The directives that can be placed in the `SMA_DEFAULTS` file are:

- `;EXCEPTION_REPORT`
- `;EXCEPTION_REPORT_CLEAR`
- `;ERROR_LEVEL`
- `;MAX_EXCEPTIONS`
- `;DIE_NO_ERROR_CODE`
- `;FATAL_MESSAGE`
- `;FATAL_MESSAGE_CLEAR`
- `;CREATE_OPCON_REPORTS_LINKS`
- `;FAIL_ON_PERSISTENT_EDITFILE`
- `;JAVA_HOME`
- `;MINUTES_TO_WAIT_FOR_EDITFILE`
- `;SEND_OUTPUT_TO_QOUT`

If any other commands or comments are found in this file, they are ignored.

:::warning

This file is read and run for **all** job files. Make sure that reasonable values are set for error processing. To override these defaults for a single job, place the desired error processing commands at the start of that job file.

:::

## CREATE_OPCON_REPORTS_LINKS

`CREATE_OPCON_REPORTS_LINKS` can be set in the `SMA_DEFAULTS` file or in any batch file. The default value is `true`.

:::tip Example

```
;CREATE_OPCON_REPORT_LINKS true | false
```

:::

## ERROR_LEVEL

:::info Note

The `ERROR_LEVEL` directive is only available from SMA Technologies. Symitar does not support the `ERROR_LEVEL` directive.

:::

An error level is the set of return codes that causes RSJ to stop processing the current Symitar batch job file (nested or not). Insert the error level directive as a comment in a Symitar batch job file.

```
;ERROR_LEVEL 1,5-10,10-12,21
```

This example states that if the program return code is in the set {1, 5, 6, 7, 8, 9, 10, 11, 12, 21}, RSJ stops processing the job immediately.

The current best practice is to place `ERROR_LEVEL` checking only at the beginning of a job file so that the effective error level is always visible. For exceptions, bracket a program with `ERROR_LEVEL` statements.

:::tip Common use cases

- To disable error checking for a job: `;ERROR_LEVEL 999` (999 is outside the normal error code range)
- To exclude error code 7 ("Terminate specification found in a Repgen"): `;ERROR_LEVEL 1-6,8-10`
- To trap all errors (recommended for new installations): `;ERROR_LEVEL 1-255`

:::

:::tip Example

```
;skip checking for error code 9
;ERROR_LEVEL 1-8, 10

%PROGRAM REPGEN
prompt : answer

;ERROR_LEVEL 1-10
```

:::

:::warning

Do not use the Episys text editor to modify job files that contain RSJ directives. The Episys editor reorders comment lines, which corrupts the directive ordering. Use a UNIX editor instead, or place RSJ directives in separate job files that you include via `%JOBFILE`.

:::

:::tip Recommended approach

Place directives in separate job files:

```
%JOBFILE TURN_OFF_CHECKING
%PROGRAM REPGEN
prompt : answer
%JOBFILE TURN_ON_CHECKING
```

:::

## FAIL_ON_PERSISTENT_EDITFILE

`FAIL_ON_PERSISTENT_EDITFILE` can be set in the `SMA_DEFAULTS` file or in any batch file. The default value is `false`.

If the job requires `EDITFILE.DATA` but `EDITFILE.DATA` already exists, RSJ waits for `MINUTES_TO_WAIT_FOR_EDITFILE` (default 10 minutes). After the wait time elapses:
- If `FAIL_ON_PERSISTENT_EDITFILE` is `true`, RSJ fails.
- If `FAIL_ON_PERSISTENT_EDITFILE` is `false`, RSJ moves `EDITFILE.DATA` to a temporary location and continues.

:::tip Example

```
; FAIL_ON_PERSISTENT_EDITFILE true | false
```

:::

## JAVA_HOME

`JAVA_HOME` can only be set in the `SMA_DEFAULTS` file. Setting this directive sets the `JAVA_HOME` environment variable and adds `JAVA_HOME/bin` to the path. The default value is `/usr/java6`.

:::tip Example

```
; JAVA_HOME "/usr/java7"
```

:::

## MAX_EXCEPTIONS

:::info Note

The `MAX_EXCEPTIONS` directive is only available from SMA Technologies. Symitar does not support the `MAX_EXCEPTIONS` directive.

:::

`MAX_EXCEPTIONS` is the maximum number of exception pages allowed. If the number of exception pages exceeds this limit, RSJ terminates the job. Insert the directive as a comment in a Symitar batch job file.

```
;MAX_EXCEPTIONS 8
```

- The default is `0` (any exceptions cause the job to terminate).
- The current best practice is to place `MAX_EXCEPTIONS` checking only at the beginning of a job file.

:::tip Common use cases

- To disable exception checking: `;MAX_EXCEPTIONS 2000000000`
- To set a reasonable limit: `;MAX_EXCEPTIONS 20` (for example, if 10–20 exception pages is normal for ACH posting)

:::

:::tip Example

```
;skip exception checking
;MAX_EXCEPTIONS 2000000

%PROGRAM REPGEN
prompt : answer

;MAX_EXCEPTIONS 0
```

:::

## MINUTES_TO_WAIT_FOR_EDITFILE

`MINUTES_TO_WAIT_FOR_EDITFILE` can be set in the `SMA_DEFAULTS` file or in any batch file. The default value is `10` minutes.

If the job requires `EDITFILE.DATA` but `EDITFILE.DATA` already exists, RSJ waits for this many minutes before either failing or moving the file, depending on the `FAIL_ON_PERSISTENT_EDITFILE` setting.

:::tip Example

```
; MINUTES_TO_WAIT_FOR_EDIT_FILE     5
```

:::

## RESTART_POINT

:::info Note

Restart points are only available from SMA Technologies. Symitar does not support them.

:::

A restart point allows you to restart a job at a particular point after a failure. A restart point can be specified in a nested job, which enables jobs to be skipped up to the restart point. Insert the restart point as a comment in a Symitar batch job file.

```
;RESTART_POINT some_name_n
```

:::info Note

Spelling and capitalization are important. RSJ looks for an exact match on restart points. If an invalid restart point is specified on the command line, no programs run and the job returns an error. Avoid spaces and tabs in restart point names.

:::

- All restart points must be unique across all nested jobs. RSJ only finds the first restart point with the specified name. Duplicates are ignored even in different files.
- After running a job with a restart point, remove the restart point from the job to prevent name collisions in future failures.

:::tip Example

**Sample job file (REPGEN.JOB):**

```
;RESTART_POINT REPGEN2
%PROGRAM REPGEN
prompt : answer
prompt2: answer
```

**Sample OpCon command line:**

```
/ops/bin/RSJ 000 REPGEN.JOB REPGEN2
```

:::

To use a permanent restart point, place it in a separate file and include it via `%JOBFILE`:

:::tip Example

**PERMANENT_RESTART_POINT.JOB:**
```
;RESTART_POINT PERMANENT_RESTART_POINT
```

**JOB_THAT_NEEDS_RESTART_POINT.JOB:**
```
%JOBFILE PERMANENT_RESTART_POINT.JOB
%PROGRAM REPGEN
prompt : answer
prompt2: answer
```

:::

## SCRIPT

:::info Note

The `SCRIPT` directive is only available from SMA Technologies. Symitar does not support the `SCRIPT` directive.

:::

`SCRIPT` allows you to run external scripts and programs inside a Symitar job file. Insert the script directive as a comment.

```
;SCRIPT program arguments
```

- The program's exit code is checked. Any non-zero exit code causes RSJ to terminate.
- Test the program outside the Symitar environment before using it in a job file.

:::tip Example

```
%JOBFILE SOME_SCRIPT_JOB

File: SOME_SCRIPT_JOB
;SCRIPT program arguments
```

:::

Place `SCRIPT` commands in separate job files to protect them from Episys editor reordering.

## SEND_OUTPUT_TO_QOUT

`SEND_OUTPUT_TO_QOUT` can be set in the `SMA_DEFAULTS` file or in any batch file. The default value is `false`. SAJ always sends output to QOUT and does not support a directive to control this.

:::tip Example

```
;SEND_OUTPUT_TO_QOUT true | false
```

:::

## Generalized exception handling — EXCEPTION_REPORT

`EXCEPTION_REPORT` causes RSJ to terminate if any matching report has too few or too many pages. The report name may contain a wildcard `*` to match multiple reports. Once defined, this directive is active for the remainder of the job file or until an `EXCEPTION_REPORT_CLEAR` directive is encountered.

```
;EXCEPTION_REPORT "REPORT NAME" #_of_pages LT|LE|GT|GE
```

- The first argument is the report name. Quotes are mandatory. Use `\*` to match a literal asterisk.
- The second argument is the page count for the comparison.
- The third argument is one of four comparison operators: `LT` (less than), `LE` (less than or equal), `GT` (greater than), `GE` (greater than or equal).

:::info Note

The quotes around the report name are mandatory. This directive is turned off by default.

:::

:::tip Example

```
;Error if any report name ending in EXCEPTION is >= 10 pages
;EXCEPTION_REPORT "* EXCEPTION" 10 GE

;Error if any report name starting with EXCEPTION is >= 10 pages
;EXCEPTION_REPORT "EXCEPTION *" 10 GE

;Error if report TEST is < 10 pages
;EXCEPTION_REPORT "TEST" 10 LT
```

:::

## Generalized exception handling — EXCEPTION_REPORT_CLEAR

`EXCEPTION_REPORT_CLEAR` clears all previous `EXCEPTION_REPORT` directives.

```
;EXCEPTION_REPORT_CLEAR
```

:::tip Example

```
;Clear all previous EXCEPTION_REPORT directives
;EXCEPTION_REPORT_CLEAR
```

:::

**RSJ default values:**
- `;ERROR_LEVEL 1-255`
- `;MAX_EXCEPTIONS 0`

## Best practices for error checking

### Understanding error codes and exceptions

- **Error codes** are return codes from Symitar programs. Each credit union determines which error code returns are acceptable for their environment.
- **Exception reports** are pages in the output that indicate processing problems. Every program has its own exception reports, and the number of exception pages indicates severity.

### Setting appropriate limits

When setting `MAX_EXCEPTIONS`, consider:

- **Normal operations**: What is the average number of exception pages for this job? For example, on a normal day ACH posting might have 10–20 pages of exceptions.
- **Problem indicators**: If 30–40 pages of exceptions appear, it may indicate a double-posted file or an old file being re-processed.
- **Credit union size**: The number of allowable exceptions differs per credit union and changes as the credit union grows.

:::tip Recommendation

Always use `ERROR_LEVEL` and `MAX_EXCEPTIONS` together. RSJ checks both exceptions and the program return code, so using both provides comprehensive error detection.

:::

### Recommended configuration

For most installations, a good starting point in the `SMA_DEFAULTS` file is:

```
;ERROR_LEVEL 1-255
;MAX_EXCEPTIONS 0
;DIE_NO_ERROR_CODE TRUE
```

Adjust `MAX_EXCEPTIONS` per job or job type based on your credit union's normal processing patterns.

## DIE_NO_ERROR_CODE

`DIE_NO_ERROR_CODE` directs RSJ to stop processing if no Symitar error code is found. Some Symitar programs die unexpectedly without producing an error code. Symitar recommends enabling this directive for all installations. The default value is `TRUE`.

```
;DIE_NO_ERROR_CODE [TRUE|FALSE]
```

## FATAL_MESSAGE

`FATAL_MESSAGE` adds a string that RSJ searches for to determine whether processing should stop. This covers situations where a Symitar error message is not caught by standard RSJ error handling. These messages are case-sensitive.

The following messages are enabled by default:

- `This batch stream is now terminated`
- `Inconsistent answers to batch questions`
- `Entire Batch Job File Terminated!`
- `CURRENT BATCH JOB TERMINATED`
- `REMAINDER OF BATCH JOB FILE TERMINATED`
- `System Is Not Available`
- `Error 13: Permission denied`
- `System logon problem`
- `Unspecified error result code of`
- `DISKBACKUP FAILED`
- `Terminated remainder of batch job`

```
;FATAL_MESSAGE "message string"
```

## FATAL_MESSAGE_CLEAR

`FATAL_MESSAGE_CLEAR` removes all fatal error messages, including the defaults. This allows complete customization of error handling. If you use this directive, you must use `FATAL_MESSAGE` to add any desired stop messages, since no messages remain after the clear.

```
;FATAL_MESSAGE_CLEAR
```

## Troubleshooting RSJ

### Diagnosing job failures

When a job fails, RSJ provides diagnostic information in the job output. To determine why a job failed, complete the following steps:

1. Look at the bottom of the job output. RSJ always outputs the reason it stopped processing the job file. Look for SMA Technologies output lines, which always begin with `DEBUG`, `INFO`, `WARN`, or `FATAL` followed by the date and a message.

   :::tip Example RSJ output lines

   ```
   FATAL Thu Sep 6 11:55:01 2007 FATAL - TOO MANY EXCEPTIONS in EXCEPTION REPORT
   FATAL Thu Sep 6 11:55:01 2007 SMA Exits status is -140=
   ```

   :::

2. Identify which file and program aborted:
   - RSJ always outputs the name of the file it opened and outputs a message when it finishes processing a file.
   - RSJ always outputs the name of the program it is running and which job file it is in.
   - For nested jobs, trace through SMA Technologies messages to see which files have been opened and closed.

3. The easiest way to view job output is through JORS — select **View Job Output** on a job in the OpCon Schedule Operations screen.

### Why jobs run in other environments but not RSJ

If a job file runs in `ssj`, AutoBatch, or interactively but not in RSJ:

- **AutoBatch and ssj do not perform error checking.** If an error exists, these tools continue processing the job file. RSJ stops the moment it detects an error.
- **Episys does not perform error checking on a running job.** RSJ stops on the first detected error.
- **Common causes**: There is an issue in the job file, or there are too many exceptions. Look at the bottom of the output file to see why RSJ stopped.

:::warning

Do not use RSJ and AutoBatch together, and do not use RSJ and ssj together. Operational issues will surface. RSJ is designed to eliminate these operational issues. ssj depends on AutoBatch, so it is unsafe to run with RSJ.

:::

### Troubleshooting RSJ directives

If RSJ appears to be ignoring `MAX_EXCEPTIONS`, `ERROR_LEVEL`, `SCRIPT`, or `RESTART_POINTS` directives, check the following:

1. **Double semicolons**: A semicolon was included at the beginning of the comment command, producing `;;` at the start of the line. Symitar interfaces add an additional `;` before the actual comment, resulting in `;;Command`, which RSJ does not recognize. When using the Episys text editor, do not add a leading semicolon.
2. **Incorrect syntax**: Recheck the exact syntax carefully.
3. **Episys editor reordering**: All Episys job file editors move comment lines to the top of the file, producing a job file that RSJ cannot process correctly. Use a UNIX editor for all job files that contain RSJ directives.

### Recommended solution

Place RSJ commands in separate job files and include them via `%JOBFILE`:

:::tip Example

```
%JOBFILE TURN_OFF_CHECKING
%PROGRAM CLOSEDAY
%JOBFILE TURN_ON_CHECKING

TURN_OFF_CHECKING:
;MAX_EXCEPTIONS 20000000

TURN_ON_CHECKING:
;MAX_EXCEPTIONS 0
```

:::

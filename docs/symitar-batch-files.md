---
title: Symitar batch files
description: "Reference for Symitar batch file syntax, control file format, program commands, and processing directives used with RSJ."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Symitar batch files

## What is it?

Symitar batch files are job files that define which programs to run and in what order. They also contain prompt responses that RSJ uses to answer interactive program questions automatically. Understanding the batch file format is essential for configuring RSJ jobs and setting up control files for automated processing.

- Use this reference when building or modifying Symitar batch job files for use with RSJ.
- Use the program commands (`@SYSTEMDATE`, `@PREVSYSTEMDATE`, etc.) to pass dynamic date values to batch jobs.
- Use the processing directives (`%PROGRAM`, `%JOBFILE`, `%RUNDATE`, etc.) to control job flow.

## Symitar control files / response files

When a user enters parameters for a Symitar batch file, the Symitar interface builds a response file. The file contains the prompt and the value entered by the user. A colon (`:`) separates the prompt from the value.

### Control file

:::tip Example

```
Group Type: 0
Create Exception Item Entries? : N
Group List: @
Posting Method: 8
Distribution Method: 0
Ignore Zero Amount EFT Records?: N
Allow Posting WarnCode List : NONE
Hold method: 0
Hold release method: 0
Special ratio: 00
Loan payment amount: 0
Take partial Loan Payments?: Y
Loan Payment Skips: 17
Start Loan Payments Through: --/--/--
Take partial Distribution Deposits?: Y
Deposits to IRS accounts Non-Reportable?: N
Reg E due to ACH Origination?: N
GL Category: 000
Effective date: --/--/--
```

:::

## Symitar batch file program commands

### @

- Default value.
- Interactively prompts for a response in both interactive and batch jobs. No RSJ job may contain a `@` symbol.

### !

- Default value.
- When the program runs interactively, prompts the user for a response.
- When the program runs in a batch job, does not prompt the user for a response.

### @PREVSYSTEMDATE

- Prompts for or uses the previous processing date.
- You can add an optional numeric offset: `@PREVSYSTEMDATE-10`

### @SYSTEMDATE

- Prompts for or uses today's processing date.
- You can add an optional numeric offset: `@SYSTEMDATE+10`

### @DATE(month,day,year)

- Uses the current date.
- **Month** — numeric, ranges from 1 to 12. Can also be `THIS` to use today's UNIX system date.
- **Day** — numeric, ranges from 1 to 31. Can also be `THIS` to use today's UNIX system date.
- **Year** — numeric, ranges from 00 to 99. Can also be `THIS` to use today's UNIX system date.
- You can add an optional numeric offset: `@DATE(month,day,year)+10`

:::info Note

Symitar typically processes `@PREVSYSTEMDATE`, `@SYSTEMDATE`, and `@DATE` commands correctly in a job file. It is not necessary to change them to `!`.

:::

## Symitar batch file processing directives

### %PROGRAM program_name

Runs `program_name`.

### %SPLIT program_name

Runs `program_name`. This command is currently ignored by RSJ.

### %JOIN

Waits for all previous `%SPLIT` programs to finish processing. This command is currently ignored by RSJ.

### %JOBFILE job_file_to_include

Includes and runs this Symitar batch file.

### %RUNDATE option

The `%RUNDATE` option forces or excludes processing on given days.

:::info Note

`%RUNDATE` provides only basic scheduling options that do not always produce the expected results. Each `%RUNDATE` command is logically OR'd with the previous `%RUNDATE` commands for a single boolean output.

:::

### %RUNDATE MMDDYYY

Runs this script only on this date.

### %RUNDATE MMDDYY

Runs this script only on this date.

### %RUNDATE MATCHSINCEPREVIOUS

Iteratively matches each date between the previous system date and the current system date for all `%RUNDATE` commands.

### %RUNDATE NOMATCHDAY (MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)

Runs on any day that does NOT match the specified day.

### %RUNDATE MATCHDAY (MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)

Runs on any day that matches the specified day.

### %RUNDATE MATCHDATE(mm,dd,yyyy)

Runs on this date only.

### %RUNDATE MATCHDATE(--,FINAL,--)

Runs on the final day of the month. `--` indicates all days, months, or years. `FINAL` indicates end of month.

### %RUNDATE MATCHDATE(--,FINAL-1,--)

Runs on the final day of the month minus 1 day.

- `--` indicates all days, months, or years.
- Math is only permitted in the day field.
- The field can contain `day|THIS|FINAL`, a `+` or `-`, and a numeric offset.
- `FINAL` is only permitted in the day field.

### %RUNDATE MATCHDATE(--,THIS,--)

Runs today, on every month and every year.

### %DIRECTORY nnn %QUEUE m %PRIORITY n %USR 0000

Not used by SMA Technologies.

### ;

This is a comment. RSJ also uses the semicolon prefix for RSJ-specific directives such as `;ERROR_LEVEL` and `;MAX_EXCEPTIONS`. See [Symitar job file commands](operations/symitar-job-file-commands.md).

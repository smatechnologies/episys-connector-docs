---
title: RSJ utility programs
description: "Reference for RSJ utility programs used to manage ACH files, retrieve report sequence numbers, archive job output, and configure Symitar job files."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# RSJ utility programs

## What is it?

RSJ includes a set of utility programs installed in `/ops/bin/` that support common automation tasks for Episys credit union processing. These utilities provide ACH file validation, report sequence number retrieval, job output archiving, permission management, and Symitar job file configuration.

- Use these utilities in OpCon jobs to automate downstream processing after RSJ batch jobs complete.
- Use `LookForReportInRSJ` to retrieve a report sequence number and store it in an OpCon property for use in downstream jobs.
- Use `backup_and_prune` nightly to archive and clean the `opcon_reports` directory.
- Use `update_scf` to set prompt responses in Symitar job files before running them through RSJ.

## ach_processed

Validates that a given ACH file has not been processed before. Stores its database of previously processed ACH files at `/SYM/SYMnnn/BATCH/ach_processed`. Returns 0 on successful completion (the file has not been processed before).

**Usage:** `/ops/bin/ach_processed SYM# ACH_FILE`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).

## backup_and_prune

Tars and compresses the `/SYM/SYMnnn/opcon_reports` directory, stores the resulting file in `/SYM/SYMnnn/opcon_backup`, and removes older backup files and older files in the `opcon_reports` directory.

SMA Technologies highly recommends that all credit unions run this program nightly.

**Usage:** `/ops/bin/backup_and_prune SYM#s 7 30`

- **SYM#** — The SYM number in the form SYM000.
- **days_to_keep_reports** — Number of days to keep files in the report directory.
- **days_to_keep_backup** — Number of days to keep backup files.
- **Returns** — 0 on successful completion.

## backup_reports

:::info

Use `backup_and_prune` instead of this program.

:::

Tars and compresses the `/SYM/SYMnnn/opcon_reports` directory and stores the resulting file in `/SYM/SYMnnn/opcon_backup`.

**Usage:** `/ops/bin/backup_reports SYM#`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| 11 | Did not pass in SYM# |
| 15 | Bad SYM format |
| 16 | SYM does not exist |
| 17 | Cannot find opcon_reports directory |
| 18 | Backup file already exists — will not overwrite |
| 19 | Cannot build tar file |
| 20 | Cannot remove old files in opcon_reports |

## change_perms

Changes the owner, group, and permissions on a file. Typically used after a file transfer.

**Usage:** `/ops/bin/change_perms SYM_USER full_path_to_file`

- **SYM_USER** — The user of the desired SYM (for example, SYM000, SYM100, or SYM999).
- **full_path_to_file** — The fully qualified path to the file.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| -11 | Wrong number of arguments |
| -15 | Bad SYM format |
| -16 | SYM does not exist |
| -17 | Unable to change ownership of file |
| -18 | Unable to change group of file |
| -19 | Unable to change permissions of file |
| -20 | File does not exist |

## compare_fed_totals

A UNIX script that compares the ACH totals from the Federal Reserve ACH file and the totals computed by Episys.

For additional information about using `compare_fed_totals` in the Start Image, refer to [Episys: Compare ACH Totals](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-compare-ach-totals) in the Concepts online help.

**Usage:** `/ops/bin/compare_fed_totals SYM# fed_file batch_output_file`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **fed_file** — An explicit path, or the program checks `/SYM/SYMnnn/LETTERSPECS` then `/SYM/SYMnnn/`.
- **batch_output_file** — An explicit path, or the program checks `/SYM/SYMnnn/REPORT` then `/SYM/SYMnnn/`.

:::info Note

If the format of the report changed from what SMA Technologies was expecting, the `fed_totals` and `batch_output_totals` values may be undefined. If this is the case, send the files to SMA Technologies.

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Compare was good |
| 1 | Compare was bad |
| 2 | Fed file was found |
| 3 | Batch output file was not found |
| 5 | Unable to open fed file (check permissions) |
| 6 | Fed file has a format error (contact SMA Technologies) |
| 7 | Unable to open batch output file (check permissions) |
| 8 | Too many strings were found (contact SMA Technologies) |
| 9 | Unable to correctly parse batch amounts (contact SMA Technologies) |
| 11 | Arguments to program are bad (refer to Usage above) |
| 15 | Bad SYM format — pass in `nnn` or `SYMnnn` |
| 16 | SYM directory does not exist |

## ExtractDayDataForToken

Extracts comma-delimited information for the current day from a file that has groups for each day of the month, then sets an OpCon property with that information for downstream processing.

**Usage:** `/ops/bin/ExtractDayDataForToken PathToFile PropertyName PathToUNIX_MSGIN EventUser "EventToken"`

- **PathToFile** — Path to the file containing group data.
- **PropertyName** — Name of the property to set.
- **PathToUNIX_MSGIN** — Fully qualified path to the MSGIN directory of the agent.
- **EventUser** — OpCon user to use in creating the event.
- **EventToken** — Password of the OpCon user. Place in double quotes.

:::tip Example

```
/ops/bin/ExtractDayDataForToken /SYM/SYM000/DATAFILES/IRAGROUPS IRAGroupToken /usr/local/lsam/MSGIN/3100 ocadm "EventToken"
```

:::

:::info Note

Commas in the data are replaced by the `^` symbol because SAM uses commas to delimit fields in events. Use `translate2commas` when using the property with `update_scf`.

:::

## ExtractMonthDataForToken

Extracts comma-delimited information for the current month from a file that has groups for each month of the year, then sets an OpCon property for downstream processing.

**Usage:** `/ops/bin/ExtractMonthDataForToken PathToFile PropertyName PathToUNIX_MSGIN EventUser "EventToken"`

- **PathToFile** — Path to the file containing group data.
- **PropertyName** — Name of the property to set.
- **PathToUNIX_MSGIN** — Fully qualified path to the MSGIN directory of the agent.
- **EventUser** — OpCon user to use in creating the event.
- **EventToken** — Password of the OpCon user. Place in double quotes.

## find_programs

Finds all Symitar batch jobs in a specific SYM and outputs an OpCon-formatted execution line for each. Use JORS to retrieve the output, then copy the execution lines into new OpCon job command lines.

**Usage:** `/ops/bin/find_programs SYM#`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## find_prompts

Finds all possible user prompts in a nested Symitar job. Use this program to facilitate converting a Symitar job file into OpCon.

**Usage:** `/ops/bin/find_prompts SYM# job_file`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **job_file** — Job file to search for prompts.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## ForceLogOff

Automatically logs off any user logged into a specific SYM.

**Usage:** `/ops/bin/ForceLogOff SYM#`

- **SYM#** — The three-digit SYM number (for example, 100).

:::tip Example

```
/ops/bin/ForceLogOff 000
```

:::

:::warning

If users are running Episys jobs interactively, running this command can lock up the database and require a SYM reload. See [Canceling an RSJ job](operations/canceling-rsj-job.md) for more information.

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## ForceLogOffSSO

Automatically logs off any users connected to a specific SYM through an SSO (Single Sign-On) session. Unlike `ForceLogOff`, this utility targets only SSO sessions — identified by `SSO=` in the process table — and leaves non-SSO interactive sessions running. Added in version 21.00.0010.

**Usage:** `/ops/bin/ForceLogOffSSO SYM#`

- **SYM#** — The three-digit SYM number (for example, `000`).

:::tip Example

```
/ops/bin/ForceLogOffSSO 000
```

:::

:::warning

If users are running Episys jobs interactively through SSO sessions, running this command terminates those sessions immediately. Verify that no interactive jobs are running before using this utility.

:::

A log entry recording the number of users forced off is written to `./log/SCRIPTLOG.MMDDYY`.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## install_dates

Installs all necessary files in all SYMs for proper RSJ configuration. Also adds `SMA_DATES.JOB` after all `%PROGRAM CLOSEDAY` and `%JOBFILE CLOSEDAY` occurrences in all job files in the `/SYM/SYMnnn/BATCH` directories.

**Usage:** `/ops/bin/install_dates`

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| 10 | Gross error |

## integrate_message

Updates Episys job file prompts with responses from a note file. Primarily used when a newline (`\n`) must be inserted into a job file.

**Usage:** `/ops/bin/integrate_message /SYM/SYMnnn/BATCH/SOME_BATCH_JOB /full_path_to_notefile [occurrence]`

- **SOME_BATCH_JOB** — Fully qualified path to an Episys batch job file.
- **NOTEFILE** — Fully qualified path to the note file containing prompts and updated responses. The note file has the same format as a batch job.
- **occurrence** — Optional. Specifies which occurrence of the prompt to start substituting at. Default is 1. Only the first prompt in the note file is used as the index guide for the occurrence logic.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## LookForReportInRSJ

:::info Note

This utility is recommended for locating SEQ numbers for all reports generated by batch jobs run via RSJ and housed on your Symitar host.

:::

Searches the batch output file in `/SYM/SYM###/opcon_reports/<BatchJobName>` for the SEQ number of a report or output file. Sets a property in OpCon with the SEQ number for use in downstream processing.

For additional information, refer to [Episys: Find Report from RSJ Output](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-find-report-from-rsj-output) in the Concepts online help.

:::tip Example

```
/ops/bin/LookForReportInRSJ nnn GOODNIGHT "SOME REPORT" TOKEN_NAME /usr/local/lsam/MSGIN ocadm "EventToken"
```

:::

This script takes seven required arguments and one optional argument:

1. Three-digit SYM number
2. Name of the subdirectory to search (the job name used when RSJ was invoked)
3. Name of the report whose sequence number is of interest
4. Property name to set
5. Path to the MSGIN directory of the agent
6. OpCon user ID for the event (must have "Maintain Tokens" permission)
7. External password of the OpCon user ID (in double quotes)
8. *(Optional)* Occurrence of the title to search for (default is 1)

:::info Note

`LookForReportInRSJ` retrieves the sequence number from the batch output file. The batch output file is not created until the Symitar batch job completes.

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | No error |
| -1 | No SYM number specified |
| -2 | No report directory specified |
| -3 | No report name specified |
| -4 | No property name specified |
| -5 | No MSGIN path specified |
| -6 | No OpCon user specified |
| -7 | No OpCon user password specified |
| -8 | Invalid MSGIN specified |
| -9 | Invalid report directory |
| -10 | Specified report not found |

## LookForReport

:::info Note

Use this utility only when `LookForReportInRSJ` is unsuccessful.

:::

Searches for the SEQ number of a batch output file or report in `/SYM/SYM###/REPORT`. When it finds the file, it passes the SEQ number back to the OpCon server to be stored in a property using MSGIN.

This program takes a variable number of arguments. The first six required arguments alone find the last batch output file for the job. The optional seventh argument finds an individual output report within that batch output report. The optional eighth argument finds a specific occurrence of the report name.

:::info Note

This program only finds the last occurrence of the batch output file. If the batch output file exists but the report name does not, the program fails. If the Symitar job runs multiple times per day, run this job immediately after the run whose output you need.

:::

:::tip Example

```
/ops/bin/LookForReport nnn "SYMITAR_JOBFILE" "PROPERTY_NAME" /usr/local/lsam/MSGIN ocadm "EventToken"
```

or

```
/ops/bin/LookForReport nnn "SYMITAR_JOBFILE" "PROPERTY_NAME" /usr/local/lsam/MSGIN ocadm "EventToken" "REPORT_NAME" 3
```

:::

**Arguments:**

1. Three-digit SYM number
2. Symitar job file that produced the batch output
3. Property name for the sequence number
4. Path to the MSGIN directory on the local AIX machine
5. OpCon external event user
6. OpCon external event password
7. *(Optional)* Report name to find within the batch output
8. *(Optional)* Occurrence of the report name to find

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| -85 | Cannot create MSGIN file |
| -81 | Illegal SYM number |
| -10 | Wrong number of arguments |
| -9 | Invalid Symitar REPORT directory |
| -8 | Invalid MSGIN directory |
| -1 | Cannot open REPORT file |
| 0 | Success |
| 10 | Report not found |
| 20 | Report was found in batch output, but no physical file exists |

## optical_transfer

Takes a list of files to be archived (via a special Symitar repgen) and moves them to archival storage via FTP. If a transfer fails, the utility automatically retries using passive FTP mode.

**Usage:** `/ops/bin/optical_transfer SYM# sequence_number ftp_username ftp_password ftp_hostname[:port] ftp_directory_to_place_files [ftp_extension_to_append]`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **sequence_number** — The name of the report file containing the list of reports to archive.
- **ftp_username** — The remote FTP username.
- **ftp_password** — The remote FTP password.
- **ftp_hostname** — The remote FTP machine. Append `:port_number` for non-standard ports (FTP servers typically use port 21).
- **ftp_directory** — Where to place the files on the remote machine (relative to the FTP server's default path).
- **ftp_extension_to_append** — Optional extension to append to all transferred files.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| -10 | Wrong number of arguments |
| -81 | Illegal SYM syntax for argument 1 |
| -82 | Unknown SYM specified |
| -83 | FTP file list does not exist |
| -84 | Cannot open FTP file list |
| -85 | Cannot find or read a report file to transfer |
| -86 | Cannot transfer a file |
| -87 | No files found to transfer |
| 8 | Transfer output file was not created — FTP may have failed; verify parameters manually |
| 9 | Transfer output file is too small — FTP may have failed; verify parameters manually |
| 10 | Transfer output contains error keywords — FTP may have failed; verify parameters manually |

## optical_transfer_sftp

Takes a list of files to be archived (via a special Symitar repgen) and moves them to archival storage via SFTP. Added in version 18.00.0000. Uses the same argument structure as `optical_transfer` but communicates over SFTP instead of FTP. Unlike `optical_transfer`, this utility does not perform a passive mode fallback on failure.

:::note

SMA Technologies recommends using `SMASFTPClient` instead of this utility for new SFTP transfer configurations. `SMASFTPClient` is not affected by Symitar's OS upgrade process, which can remove third-party modules from the system.

:::

**Usage:** `/ops/bin/optical_transfer_sftp SYM# sequence_number sftp_username sftp_password sftp_hostname[:port] sftp_directory_to_place_files [sftp_extension_to_append]`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **sequence_number** — The name of the report file containing the list of report sequence numbers to transfer.
- **sftp_username** — The remote SFTP username.
- **sftp_password** — The remote SFTP password.
- **sftp_hostname** — The remote SFTP machine. Append `:port_number` for non-standard ports.
- **sftp_directory** — The destination directory on the remote machine.
- **sftp_extension_to_append** — Optional extension to append to all transferred files.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| -10 | Wrong number of arguments |
| -81 | Illegal SYM syntax for argument 1 |
| -82 | Unknown SYM specified |
| -83 | SFTP file list does not exist |
| -84 | Cannot open SFTP file list |
| -85 | Cannot find or read a report file to transfer |
| -86 | Cannot transfer a file |
| -87 | No files found to transfer |
| 8 | Transfer output file was not created — SFTP may have failed; verify parameters manually |
| 9 | Transfer output file is too small — SFTP may have failed; verify parameters manually |

## print_batch

Prints the batch output report from the most recent OpCon run of a Symitar batch job. Run this utility separately for each batch output report desired.

**Usage:** `/ops/bin/print_batch opcon_reports_directory print_queue_name`

- **opcon_reports_directory** — Full path to the directory containing the batch output report.
- **print_queue_name** — Name of the UNIX print queue to print to.

:::tip Example

```
/ops/bin/print_batch /SYM/SYM000/opcon_reports/GOODNIGHT lp0
```

:::

## qb_sma

Displays all jobs running in batch queues and any interactive RSJ jobs. Similar to the Symitar command `qb`.

**Usage:** `/ops/bin/qb_sma`

## RUN_BATCHHOSTCONTROL_JOB

Runs a Symitar batch job by reading the `%PROGRAM` directive from a batch file, then running that program directly with the remaining batch file content as its input. Unlike RSJ, this utility does not perform error checking, lock file management, or batch output archiving. Use this utility for batch host control operations that require root access.

:::note

This utility must run as the root user for backup jobs. Concurrent execution is not managed — handle any concurrency requirements through OpCon scheduling.

:::

**Usage:** `/ops/bin/RUN_BATCHHOSTCONTROL_JOB /SYM/SYMnnn/BATCH/batch_file`

- **batch_file** — Fully qualified path to a Symitar batch job file. The path must include `/SYM/SYMnnn/` so the utility can determine which SYM to run in.

:::tip Example

```
/ops/bin/RUN_BATCHHOSTCONTROL_JOB /SYM/SYM000/BATCH/DISKBACKUP.JOB
```

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| 1 | Environment setup error |
| 10 | No batch file specified on the command line |
| 15 | Batch file does not exist |
| 20 | Cannot open batch file |
| 25 | Cannot open temporary input file |
| 30 | Batch file does not contain a `%PROGRAM` directive |
| 35 | Program specified by `%PROGRAM` does not exist in `/SYM/SYMPR/` |
| 40 | `/SYM/SYMnnn` path not found in batch file name |
| 45 | Cannot change directory to the SYM directory |

## restore_backup_reports

Restores a file created by `backup_reports` and places the files in `/SYM/SYM###/opcon_reports`. Specify the file name without the full path — the program prepends the correct path automatically. You are responsible for removing any unneeded or unwanted files after restoration.

**Usage:** `/ops/bin/restore_backup_reports SYM# file_name`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **file_name** — The file name to restore.

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| 11 | Did not pass in SYM# |
| 15 | Bad SYM format |
| 16 | SYM does not exist |
| 17 | Illegal file extension |
| 18 | Restore file does not exist |
| 19 | Unable to restore files |

## SetServiceStatus

Controls Symitar services for a given SYM.

This script takes three arguments:

1. **Service name** — One of: `AUTOBATCH`, `SYMCONNECT`, `AUDIO`, `ATM`, `CREDIT`
2. **SYM number** — Three-digit SYM number (nnn)
3. **Status** — Must be `ONHOST` or `OFFHOST`

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | No error |
| 1 | No service name specified |
| 2 | No SYM number specified |
| 3 | No status specified |
| 4 | Invalid service name specified |
| 5 | Invalid status specified |
| 6 | Service has status other than On Host or Off Host |
| 7 | Status change was not successful after retry |

## sma_copyjob

Prepends `sma_` to a nested job file name and creates a new job. This allows safe editing of prompt settings without affecting the original job.

**Usage:** `/ops/bin/sma_copyjob SYM# job_file`

- **SYM#** — The SYM number (for example, SYM000, SYM100, or SYM999).
- **job_file** — The job file name.

:::info Note

Episys has a 32-character limit on job names. This program can exceed that limit. You are responsible for renaming or editing the affected job files as needed.

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## SMA_DATES.JOB

`SMA_DATES.JOB` is a Symitar batch job that updates the `SMA_DATES` file used by RSJ to obtain the current processing date. Run this job whenever the processing day changes or when `install_dates` has been run.

## SMADump_scf

Displays spaces and non-printable characters in Symitar control files, making it easy to diagnose prompt configuration issues.

**Command line options:**

| Option | Description |
| ------ | ----------- |
| `-f full_path_to_file` | Input file to display |
| `-v` | Print version number |

:::tip Example

```
/ops/bin/SMADump_scf -f/SYM/SYM000/BATCH/CC.LATE.FEE
```

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| -1 | Error (command line incorrectly formatted, or unable to read/write the specified file) |
| 0 | Successful completion |

## translate2commas

A wrapper around `update_scf` that translates the `^` character to a comma. Use this when a property that originally contained commas needs to be used with events — the commas were replaced by `^` symbols to avoid delimiter conflicts in SAM events.

:::tip Example

```
/ops/bin/translate2commas /ops/bin/update_scf -f/SYM/SYM999/BATCH/DEFERRED.COMP.DISTRIB.CHECKS "Group List: [[IRAGROUP]]"
```

:::

## update_scf — Update Symitar control file (response file)

Updates Symitar control files (job files) by replacing prompt responses. The command line requires the name of the control file, followed by one or more prompt/value pairs.

For additional information, refer to [Episys: Answer Prompts](http://help.smatechnologies.com/opcon/core/job-types/unix#episys-answer-prompts) in the Concepts online help.

:::info Note

By default, `update_scf` modifies all prompts with the exact prompt text. To modify only the first match, use the `-s` switch.

:::

### Command line options

| Option | Description |
| ------- | ----------- |
| `-f full_path_to_file` | Specify the file to modify |
| `-s` | Only modify the first match (default modifies all matches) |
| `-v` | Print version number |

:::tip Example

```
/ops/bin/update_scf -f/SYM/SYM000/BATCH/CC.LATE/FEE "Effective Date:[[11After25thEff]]" "Date:047"
```

:::

### Return codes and descriptions

| Returns | Description |
| ------- | ----------- |
| -1 | Error (command line incorrectly formatted, unable to read/write file, or too many prompt/value pairs) |
| 0 | Successful completion |

## Legacy utilities

The following utilities were superseded by `LookForReport` in version 14.00.0000 (2013). They are retained in the distribution for backward compatibility. For new jobs, use `LookForReportInRSJ` or `LookForReport` instead.

### LookForBatchOutputSequence

:::info Note

This utility is deprecated and will be removed in a future version of RSJ. Use `LookForReport` instead.

:::

Searches for the file name from the latest batch output file in `/SYM/SYM###/opcon_reports/<file name>`. Sets a property with the SEQ number for downstream processing.

:::tip Example

```
/ops/bin/LookForBatchOutputSequence nnn GOODNIGHT TOKEN_NAME /usr/local/lsam/MSGIN ocadm EventToken
```

:::

This script takes six arguments:

1. Three-digit SYM number
2. Name of the subdirectory to search (job name used when RSJ was invoked)
3. Property name to set
4. Fully qualified path to the MSGIN directory of the agent
5. OpCon user ID for the event (must have "Maintain Tokens" permission)
6. External password of the OpCon user ID (in double quotes)

### LookForReportSequence

:::info Note

This utility is deprecated and will be removed in a future version of RSJ. Use `LookForReport` instead.

:::

Searches for the sequence number of a report or output file from the batch output file in `/SYM/SYM###/opcon_reports/<file name>`.

:::tip Example

```
/ops/bin/LookForReportSequence nnn GOODNIGHT "SOME REPORT" TOKEN_NAME /usr/local/lsam/MSGIN ocadm EventToken
```

:::

### LookForReportSequenceInReports

:::info Note

This utility is deprecated and will be removed in a future version of RSJ. Use `LookForReport` instead.

:::

Searches for the sequence number of a report or output file from the batch output file in `/SYM/SYM###/REPORT`. Useful for finding sequence numbers of reports not created from RSJ.

:::tip Example

```
ops/bin/LookForReportSequenceInReports nnn "REPORT NAME" TOKEN_NAME /usr/local/lsam/MSGIN ocadm EventToken
```

:::

## FAQs

**Which utility should I use to find a report sequence number?**
Use `LookForReportInRSJ` for reports generated by jobs run through RSJ. Use `LookForReport` only when `LookForReportInRSJ` is unsuccessful. The three legacy utilities (`LookForBatchOutputSequence`, `LookForReportSequence`, `LookForReportSequenceInReports`) are deprecated — use the replacements instead.

**How do I archive the opcon_reports directory?**
Use `backup_and_prune` nightly. It tars and compresses the `opcon_reports` directory, stores the archive in `opcon_backup`, and removes old files based on the retention parameters you specify.

**What does update_scf do?**
`update_scf` modifies the prompt/response pairs in a Symitar control file (job file) so that RSJ can run the job in batch mode without interactive prompts. Use `find_prompts` first to identify all prompts in a job, then use `update_scf` to set the responses.

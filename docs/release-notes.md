---
sidebar_label: 'Release notes'
title: Episys Connector release notes
description: "Version history and change details for the Episys Connector (RSJ), including new features, improvements, and bug fixes."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Episys Connector release notes

## 22

### 22.00.0100

2021 December

- **Added** additional debugging output to `LookForReportSequenceInReports` to assist with diagnosing report retrieval failures. Diagnosing report retrieval failures no longer requires opening a support ticket.

### 22.00.0000

2021 December

- **Fixed** an issue where utilities returned a `SYM is in an unknown state` error message by updating PATH and ENV variables to include Java 11 paths. Updating PATH and ENV variable handling eliminates a class of `SYM is in an unknown state` errors that caused batch jobs to fail unexpectedly.
- **Added** the ability for RSJ, SAJ, and utilities to add environment variables at runtime, giving operations teams more flexibility when configuring jobs without modifying system-level profiles.

---

## 21

### 21.00.0050

2021 December

- Fixed an issue in SAJ where arguments passed to `BATCHSAVEOUT.UTIL` exceeded the maximum length. Changed the working directory in SAJ so that relative paths work correctly.

### 21.00.0040

2021 November–December

- Fixed an issue in SAJ where `getcwd()` failed because the POSIX Perl module was unavailable. Changed the code to return to `$symdir/BATCH` after processing the output file.
- Fixed an issue in `LookForReportSequenceInReports` where the user name and password were not being passed correctly to the event-sending routine.

### 21.00.0030

2021 November

- Fixed an issue in SAJ where arguments passed to `BATCHSAVEOUT.UTIL` exceeded the maximum length, causing SAJ to fail.

### 21.00.0020

2021 November

- Updated `LookForReportSequenceInReports` to handle the updated batch output header format introduced in recent Episys releases.

### 21.00.0010

2021 November

- Added `ForceLogOffSSO` to the distribution.
- Fixed an issue in `copy_batch_output` where the absolute path for `BATCH_OUTPUT` exceeded the maximum length when job file names were 31 characters long. Changed the argument to use a relative path.

### 21.00.0000

2021 March

- Fixed an issue where `LookForBatchOutputSequence` failed when the Episys job was run using the `ExecuteAsRoot` utility. The `fflush()` call added to `ExecuteAsRoot` caused the version line to overwrite the first line of Symitar output (`SYMITAR SYSTEMS BATCH PROCESSING`). Updated `LookForBatchOutputSequence` to also recognize the truncated header `$TEMS BATCH PROCESSING`.

---

## 20

### 20.00.0020

2020 November

- Changed the default behavior of RSJ so that soft links to `opcon_reports` are **not** created by default. To restore the previous behavior, add `;CREATE_OPCON_REPORTS_LINKS true` to the `SMA_DEFAULTS` file or to individual batch job files.

### 20.00.0010

2020 May

- Rebuilt `ExecuteAsRootDebug` to reflect changes made to `ExecuteAsRoot` in 20.00.0000.

### 20.00.0000

2020 April

- Fixed a memory allocation issue in `ExecuteAsRoot` and `ExecuteAsRootDebug` where an array of pointers was being used without allocated memory.
- Fixed an issue where `ExecuteAsRoot` was unable to write to its temporary output file. Added code to `RSJ.pl` to ensure the temporary file is readable and writable.
- Added `ODMDIR` environment variable and set the current working directory to `/SYM/SYMxxx` when `ExecuteAsRoot` is in use.
- Added `RUN_BATCHHOSTCONTROL_JOB` to the distribution.

---

## 19

### 19.00.0500

2019 August–December

- Rebuilt the RSJ development environment on AIX 7.1 after the AIX 5.3 build host was decommissioned.
- Rewrote `change_user` in `utils.c` to correctly set secondary groups when impersonating a user.
- Reduced the number of retries in `rsj_status` from 60 to 3. Added a message to STDERR indicating that job execution will be delayed when communication issues occur.
- Removed `rsj_command` and `rsj_status` from the distribution. These binaries required access to agent configuration structures that changed between agent versions. RSJ now calls `sma_command` and `sma_status` from the agent's binary directory (`SMA_BINDIR`) instead.

### 19.00.0000

2018 December

- Updated all `LookFor*` routines to convert HTML entity `&quot;` to a literal double-quote character. This allows report names that contain quoted substrings to be specified correctly.

---

## 18

### 18.00.0200

2018 October

- Fixed `ForceLogOff` to recognize both the legacy Episys process name (`SYMITAR`) and the current format (`/SYM/SYM###/SYMITAR`). Previously, if the process was started on a previous day, the field offset was different and the process was not found.

### 18.00.0100

2018 May

- Fixed a bug in `update_scf` where a value containing a colon in the control file caused an integer conversion error. The same routine used to parse the command line was also used to parse control file lines, causing the conflict.

### 18.00.0000

2018 April

- Added a Java application (`SMASFTPClient`) that provides SFTP support for optical transfer operations.
- Added `optical_transfer_sftp`. Note: this script requires an additional module (`ssh_askpass`) to be installed to handle the password requirement. Because Symitar reformats the drive during OS upgrades, this module would be lost after each upgrade; `SMASFTPClient` is the recommended SFTP solution.

---

## 17

### 17.00.0200

2017 May–2018 January

- Updated all `LookFor*` scripts to support OpCon property names that contain multiple consecutive spaces.
- Updated `update_scf` to preserve any leading spaces in tag names. Older Episys jobs rely on space indentation in prompt fields.
- Refined the `%` tag function check in RSJ so that tags containing `% ` (percent followed by a space) are not mistakenly parsed as job file commands.

### 17.00.0100

2017 March

- Version bump to ensure this patch was uniquely identified. Contains all changes from 17.00.0000.

### 17.00.0000

2017 January

- Fixed an issue caused by a change to the `ALT_JOB_STATUS_SOCKET` mapping in the UNIX agent. The change prevented `rsj_status` from making a connection, introducing a one-minute delay into job processing while it retried.

---

## 16

### 16.00.0400

2016 June–July

- Identified the complete set of special characters requiring automatic escaping in `EncryptRootInfo`: `$`, `[`, `\`, and `"`. All other special characters do not require escaping.
- Added `ExecuteAsRootDebug` to the distribution to assist with diagnosing `ExecuteAsRoot` issues. `ExecuteAsRootDebug` does not delete the intermediate expect script file after execution, allowing it to be reviewed.

### 16.00.0300

2016 May

- Added `#` to the list of characters automatically escaped by `EncryptRootInfo`.

### 16.00.0200

2016 April

- Version bump. A pre-release of 16.00.0100 that was incomplete was distributed; this version supersedes it.

### 16.00.0100

2016 January–February

- Added support for running RSJ under the SYM user security context. Added `rsj_command` and `rsj_status` to interface with the OpCon agent dispatcher and job status display.
- Added support for temporarily elevating permissions to root for Symitar batch jobs that require root access. Added `EncryptRootInfo` and `ExecuteAsRoot` to support this feature and added the `;ExecuteAsRoot` directive to RSJ.
- Fixed `EncryptRootInfo` to escape special characters in the root password and to require password confirmation during setup.

### 16.00.0000

2015 November

- Fixed an issue where `BATCHOUTSAVE.UTIL` failed when job file names were 31 characters long. The argument now uses a relative path instead of an absolute path.
- Fixed an issue where SAJ would hang indefinitely if the input job file was not found.

---

## 15

### 15.00.0100

2015 October

- Added passive FTP fallback support to `optical_transfer`. If an FTP transfer fails, the utility retries using passive mode.

### 15.00.0000

2015 February–March

- Fixed an issue in `LookForReportSequenceInReports` where the occurrence parameter was not handled correctly. The count was being reset at the start of each file searched, so occurrence values greater than 1 never matched.
- Fixed `ForceLogOff` to recognize the updated Symitar executable name (`/SYM/SYMxxx/SYMITAR`). Previously, the search was case-sensitive and used a hard-coded field offset that did not account for the date field in the `ps -ef` output.
- Added exit code `20` to `LookForReport`: returned when a matching report is found in the batch output file but the corresponding physical file does not exist in the REPORT directory.
- Added summary file support to RSJ. See [Summary files](operations/summary-files) for configuration details.
- Added support for Symitar job names that contain special characters such as `$`.

---

## 14

### 14.00.0100

2014 November

- Rewrote the lock file handling in RSJ, SAJ, `backup_and_prune`, and `saj_split` to address race conditions introduced in version 14.00.0000.
- Fixed `LookForBatchOutputSequence` incorrectly identifying non-matching files as matches. The `compare_files()` function was returning a value with a leading `$` sign, causing false positives.

### 14.00.0000

2013 November–2014 April

- Added `LookForReport` as the new recommended utility for locating report sequence numbers. The legacy `LookFor*` utilities (`LookForBatchOutputSequence`, `LookForReportSequence`, `LookForReportInRSJ`, `LookForReportSequenceInReports`) are retained for backward compatibility.
- Fixed a race condition in `acquire_lock` used by RSJ, SAJ, `backup_and_prune`, and `saj_split`. If the lock file owner deleted the file between the existence check and the `flock` call, the waiting process would loop indefinitely.
- Fixed an issue where RSJ waited only 10 seconds for a stale `EDITFILE.DATA` file before failing.
- Added the `;MINUTES_TO_WAIT_FOR_EDITFILE` and `;FAIL_ON_PERSISTENT_EDITFILE` directives.
- Added support for specifying the SYM number in either `SYMxxx` or `xxx` format.
- Changed all `LookFor*` routines to use `PROPERTY:ADD` events instead of `TOKEN:SET`.
- Fixed an issue where `;ERROR_LEVEL` ranges such as `1-6,13,15` were not being parsed correctly.
- Removed `check_installation`.

---

## 05

### 05.20.0010

2013 October

- Fixed a permissions issue on the `mkt` binary. The file had permissions of `700`, which prevented RSJ from running it after switching to the SYM user. This caused failures in `get_final_date_of_month()`.

### 05.20.0000

2013 August–September

- Revamped the build system to eliminate multiple copies of programs and utilities that were getting out of sync.
- Added the ability to send batch output to the QOUT printer queue.
- Added the `;SEND_OUTPUT_TO_QOUT` directive to control this behavior.

---

## 01

### 01.30.0019

- Fixed an issue where setting `;CREATE_OPCON_REPORTS_LINKS false` still caused RSJ to wait for each report file before completing. For jobs that delete many report files (such as GOODNIGHT with 100+ files), this was adding over an hour to job runtime.

### 01.30.0018

- Added support for `GENERICPGM` and `ND.DUMMY` program types.
- Changed the lock file format to include the schedule date, schedule name, and job name of the job holding the lock. This information is logged when another job is waiting for the lock.

### 01.30.0017

- Fixed a divide-by-zero error when `;CREATE_OPCON_REPORTS_LINKS false` was set. The sequence number variable was not being treated as a string, causing the file existence check to be interpreted as a division operation.

### 01.30.0016

- Fixed an issue where RSJ failed to create a soft link if a repgen deleted the file it had just created. RSJ now waits up to one minute for the file to appear; if the file is not found, a message is logged and processing continues.

### 01.30.0015

- Added the `JAVA_HOME` environment variable. Defaults to `/usr/java6`. Can be overridden in `SMA_DEFAULTS` using `;JAVA_HOME "<path>"` (without a trailing slash). The `PATH` environment variable is updated to include `$JAVA_HOME/bin` and `$JAVA_HOME/jre/bin`.
- Added the `;CREATE_OPCON_REPORTS_LINKS` directive. Controls whether RSJ creates soft links in `opcon_reports` for each report file. Accepts `true` or `false`.
- Removed license file requirements from RSJ utilities.

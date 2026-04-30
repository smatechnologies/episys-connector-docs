---
title: RSJ Q&A
description: "Frequently asked questions about RSJ, covering automation, error detection, troubleshooting, and support procedures."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# RSJ Q&A

## What is it?

This page answers the most common questions about RSJ configuration, error handling, and troubleshooting. Use this as a first reference when investigating unexpected job behavior or configuring RSJ for the first time.

---

### Can you automate the handling of ACH files?

It depends. The USB security device required to access FedLine Advantage cannot be left plugged into a computer, so that step always has a manual component. Once ACH files have been downloaded to the machine, SMA Technologies' file watcher services can detect them and process them automatically. If a third-party processor is being used, SMA Technologies can automate the process. If the credit union has access to Fedline Command, the process can be automated.

### Can you monitor websites hosted by Symitar software?

SMA Technologies has limited experience in this area. Websites that are part of the Symitar system have `MCWSTART` as part of the URL. Perl scripts have been created that perform a dummy login (known to fail) and then verify that the appropriate error message is returned, confirming the website is responding and processing transactions. Additional coding could be done but has not been requested.

### How does OpCon detect the failure of a Symitar batch job?

Refer to [Symitar exit codes](../symitar-exit-codes.md) or [MAX_EXCEPTIONS](../operations/symitar-job-file-commands.md#max_exceptions).

### Will processing be completely automated when SMA Technologies leaves the site?

No. It is more important that SMA Technologies teaches personnel how to solve scheduling problems and become self-sufficient. Instead of installing a standard database, SMA Technologies trainers work with staff to develop the workflows. This means staff understand how the workflows operate and can enhance them as the environment changes.

### How do I tell SMA Technologies' output lines from Symitar lines?

SMA Technologies' lines always begin with `DEBUG`, `INFO`, `WARN`, or `FATAL` followed by the date and a message:

```
FATAL Thu Sep 6 11:55:01 2007 FATAL - TOO MANY EXCEPTIONS in EXCEPTION REPORT
FATAL Thu Sep 6 11:55:01 2007 SMA Exits status is -140=
```

### How do I figure out why my Symitar script failed?

Look at the bottom of the job output to see why RSJ stopped processing the job file. Look for SMA Technologies' output lines. The easiest way to do this is through JORS — select **View Job Output** on a job in the OpCon Schedule Operations screen.

### How do I figure out what file and program aborted?

RSJ always prints the name of the file it opens and outputs a message when it finishes processing a file. For nested jobs, trace through SMA Technologies' messages to see which files have been opened and closed.

RSJ always prints the name of the program it is running and which job file it is in. This makes it easy to see which program aborted.

### Why does my job file run in ssj/AutoBatch but not RSJ?

AutoBatch and ssj do not perform error checking. If an error exists, these tools continue processing the job file. RSJ stops the moment it detects an error. The likely cause is an issue in the job file or too many exceptions. Look at the bottom of the output file to see why RSJ stopped.

### Why does my job file run interactively but not RSJ?

Episys does not perform error checking on a running job. If an error exists, it continues processing the job file. RSJ stops the moment it detects an error. The likely cause is an issue in the job file or too many exceptions.

### Can I use RSJ and AutoBatch together?

This is highly discouraged. Operational issues will surface. RSJ is designed to eliminate these issues.

### Can I use RSJ and ssj together?

This is highly discouraged. Operational issues will surface. ssj depends on AutoBatch, so it is unsafe to run with RSJ.

### How do I not stop on exceptions?

Set `;MAX_EXCEPTIONS 2000000000` at the beginning of the script.

### How do I not stop on errors?

Set `;ERROR_LEVEL 999` at the beginning of the script.

### How do I make programs run one at a time?

Use the `-Esingle_thread` flag of RSJ.

### How do I make multiple programs run at a time?

Use the `-Emulti_thread` flag of RSJ.

### Can I move files to EDITFILE.DATA outside of RSJ?

No. RSJ overwrites the file. Use RSJ with the `-E` flag.

### RSJ is stopping on error code 7 (Terminate specification found in a Repgen). How do I stop this?

Set `;ERROR_LEVEL 1-6,8-10` at the beginning of the job and reset it after the next job.

### Why is RSJ ignoring MAX_EXCEPTIONS, ERROR_LEVEL, or SCRIPT commands?

- A semicolon was included at the beginning of the comment command, producing `;;` at the start of the line. Symitar interfaces add an additional `;` before the actual comment, resulting in `;;Command`, which RSJ does not recognize. When using the Episys text editor, do not add a leading semicolon.
- The exact syntax was not used. Recheck the syntax.
- The job file was modified with the Episys editor. Try placing the RSJ commands into separate job files:

```
%JOBFILE TURN_OFF_CHECKING
%PROGRAM CLOSEDAY
%JOBFILE TURN_ON_CHECKING

File: TURN_OFF_CHECKING
;MAX_EXCEPTIONS 20000000

File: TURN_ON_CHECKING
;MAX_EXCEPTIONS 0
```

### Why is RSJ not executing MAX_EXCEPTIONS, ERROR_LEVEL, SCRIPT, or RESTART_POINTS correctly?

- Using Episys to modify the job file is not recommended. All Episys job file editors move comment lines to the top of the file, producing a job file that RSJ cannot process correctly. Use a UNIX editor instead.
- The exact syntax was not used. Recheck the syntax.
- Place RSJ commands into separate job files and include them with `%JOBFILE`.

### I need to use BSCMOVE with RSJ.

Using BSCMOVE is no longer needed. RSJ performs copy/move of the data file to `EDITFILE.DATA`. Use this command instead:

```
/ops/bin/RSJ -E/full_path_to_data_file program_to_run_against_EDIT_FILE
```

### RSJ did not correctly delete my EDITFILE using the -d switch.

Look at the log file, a few lines from the bottom. There is likely a message indicating that RSJ was unable to delete the input file due to a lack of permissions. Run a change permissions job before running RSJ.

### RSJ processes are taking up too many system resources.

Use the AIX `nice` command to run RSJ, or use the nice value in the OpCon Job Master screen.

### How do I see what RSJ jobs are running on the AIX box?

Options include:

- In a telnet window: `ps -dfeal|grep RSJ`
- In a telnet window: `proctree`
- The Enterprise Manager also shows running jobs.

### How do I stop error checking?

Insert the following commands at the start of the job file:

```
;ERROR_LEVEL 999
;MAX_EXCEPTIONS 20000000
```

### What batch queues does RSJ use?

RSJ does not use batch queues.

### How do I effectively use the error checking in RSJ?

- Set `ERROR_LEVEL` to reflect the acceptable error codes for each program. RSJ then checks error codes automatically.
- Set `MAX_EXCEPTIONS` based on the normal exception page count for each job. Use two limits: the average number of exception pages and the number that indicates a problem.
- Always use `ERROR_LEVEL` and `MAX_EXCEPTIONS` together — RSJ checks both exceptions and the program return code.
- Adjust limits over time as new cases are discovered. When new versions of Episys evolve, error codes may change.

### What are the steps to take before calling SMA Technologies support?

1. Verify that the job runs via Symitar (both interactively and via Symitar's batch facilities). If not, modify the job deck/response files until it does.
2. Verify that there are no interactive prompts using `@`. If there are, replace them with values using `update_scf`.
3. Determine whether the problem is related to Symitar programs or your internal processing sequence. If so, SMA Technologies cannot help.
4. If the program runs correctly alone but fails when run concurrently with other Symitar jobs, use OpCon scheduling or the `-E` switch to prevent those jobs from running together.
5. If the job exits with an error code or too many exceptions, configure the appropriate RSJ options in the job file.
6. Send the nested set of job files in a tar file along with the batch job output. To create the tar file:

```
cd /SYM/SYM000/BATCH
tar -cvf my_tar_file.tar *
```

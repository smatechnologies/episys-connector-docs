# RSJ Utility Programs

## ach_processed

ach_processed validates that a given ACH file has not been processed before. It stores its database of previously processed ACH files at /SYM/SYMnnn/BATCH/ach_processed. It returns 0 on a successful completion (i.e., the file has not been processed before).

 Usage: ```/ops/bin/ach_processed sym# ACH_FILE```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).

## backup_and_prune

backup_and_prune is a program that will tar and compress the /SYM/SYMnnn/opcon_reports directory. It stores the resulting file in /SYM/SYMnnn/opcon_backup directory. It also removes older backup files and older files in the /SYM/SYMnnn/opcon_reports directory. 

It is highly recommended that all credit unions run this program nightly. The usage line contains the SMA Technologies and Symitar recommended defaults. For information on the backups, refer to the program [backup_reports](#backup_reports).

Usage: ```/ops/bin/backup_and_prune SYM000 7 30```

* **Sym#:** The sym number of the form sym000.
* **days_to_keep_reports:** # days to keep files in the report directory.
* **days_to_keep_backup:** # days to keep backup files.

### Return Codes and Descriptions

| Returns |	Description |
| ------- | ----------- |
| 0 | Successful completion |

## backup_reports

backup_reports is a program that will tar and compress the /SYM/SYMnnn/opcon_reports directory. It stores the resulting file in /SYM/SYMnnn/opcon_backup directory. Normally, users should not run this program, but rather use [backup_and_prune](#backup_and_prune).

Usage: ```/ops/bin/backup_reports sym#```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).

### Return Codes and Descriptions

| Returns |	Description |
| ------- | ----------- |
| 0 | Successful completion |
| 11 | Did not pass in sym# |
| 15 | Bad sym format | 
| 16 | Sym does not exist |
| 17 | Cannot find opcon_reports directory |
| 18 | Backup file already exists – will not overwrite file |
| 19 | Cannot build tar file |
| 20 | Cannot remove old files in opcon_reports |

## change_perms

change_perms is a program that will change the owner, group and permissions on a file. This program is typically used after a file transfer. 

Usage: ```/ops/bin/change_perms SYM_USER full_path_to_file```

* **SYM_USER:** The user of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **Full_path_to_file:** Provides the fully qualified path details to indicate where the file is located.

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0	| Successful completion |
| -11 | Wrong # of arguments to program |
| -15 | Bad sym format |
| -16 | Sym does not exist |
| -17 | Unable to change ownership of file |
| -18 | Unable to change group of file |
| -19 | Unable to change permissions of file |
| -20 | File does not exist |

## compare_fed_totals

compare_fed_totals is a UNIX script that will compare the ACH totals from the Federal Reserve ACH file and the totals as computed by Episys. 

For additional information that applies to Episys Details with compare_fed_totals in the Start Image, refer to [Episys: Compare ACH Totals](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-compare-ach-totals) in the Concepts online help.

Usage: ```/ops/bin/compare_fed_totals sym# fed_file batch_output_file```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **fed_file:** An explicit path or the program will check:
    * /SYM/SYMnnn/LETTERSPECS
    * /SYM/SYMnnn/
* **batch_output_file:** An explicit path or the program will check:
    * /SYM/SYMnnn/REPORT
    * /SYM/SYMnnn/

:::info Note

Regarding fed_totals and batch_output_totals, if the format of the report changed from what SMA Technologies was expecting, these values may be undefined. If this is the case, send the files in question to SMA Technologies.

:::

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Compare was good |
| 1 | Compare was bad |
| 2 | Fed file was found |
| 3 | Batch output file was not found |
| 5 | Unable to open fed file (check permissions) |
| 6 | Fed file has a format error (call SMA Technologies) |
| 7 | Unable to open batch output file (check permissions) |
| 8 | Too many strings were found (call SMA Technologies) |
| 9 | Unable correctly parse batch amounts (call SMA Technologies) |
| 11 | Arguments to program are bad (refer to Usage above) |
| 15 | Bad sym format -- pass in nnn or SYMnnn |
| 16 | SYM directory does not exist |

## ExtractDayDataForToken

This utility extracts comma delimited information from files that have "groups" for each day of the month. This information (for the current day) is retrieved from the file and then used to set an OpCon token for downstream processing. For an example of the format of this type of file, refer to [ExtractMonthDataForToken](#extractmonthdatafortoken).

:::tip Example 

 The file IRAGROUPS contains group data by day of the month. The goal is to populate the token called IRSGroupToken with this information and then use update_scf to set the response to a prompt.

```/ops/bin/ExtractDayDataForToken /SYM/SYM000/DATAFILES/IRAGROUPS```

```IRAGroupToken``` ```/usr/local/lsam/MSGIN/``` ```3100``` ```batchuserpassword```

* The first argument is the path to the file that contains the group data.
* The second argument is the name of the token to set.
* The third argument is to the fully qualified path to the MSGIN directory of the LSAM.
* The forth argument is the OpCon user to use in creating the event.
* The fifth argument is the password of the OpCon user. Place the password in double quotes.

:::

:::info Note

The commas in the data for ExtractDayDataForToken and ExtractMonthDayForToken will be replaced by the ^ symbol. 

This is because SAM uses the comma to delimit fields in events. 

The program ```translate2commas``` must be used when using the token with update_scf.

:::

## ExtractMonthDataForToken

This utility extracts comma delimited information from files that have "groups" for each month of the year. This information (for the current month) is retrieved from the file and then used ti set an OpCon token for downstream processing.

##### Program Arguments:

* The first argument is the path to the file that contains the group data.
* The second argument is the name of the token to set.
* The third argument is to the fully qualified path to the MSGIN directory of the LSAM.
* The fourth argument is the OpCon user to use in creating the event.
* The fifth argument is the password of the OpCon user. Place the password in double quotes.

### ExtractMonthDataForToken Example

:::tip Example

01:5012,5101,5004,5006

02:5012,5102

03:5012,5103

04:5012,5104,5004

05:5012,5105

06:5012,5106

07:5012,5107,5004,5006

08:5012,5108

09:5012,5109

10:5012,5110,5004

11:5012,5111

12:5012,5112

:::

## find_programs

find_programs is a program that will find all Symitar batch jobs in a specific sym. This program exists to facilitate the conversion of a Symitar job file into OpCon. 

The output of this program is an OpCon formatted execution line of all Symitar batch jobs. JORS should be used to retrieve the output of this executable, and then cut and paste from this file into the command line section of a new OpCon job.

 Usage: ```/ops/bin/find_programs sym#```

* **SYM#:** The sym number of the desired sym (e.g., SYM00, SYM100, or SYM999).

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## find_prompts

find_prompts is a program that will find all possible user prompts in a nested Symitar job. This program facilitates the conversion of a Symitar job file into OpCon.

Usage: ```/ops/bin/find_prompts sym# job_file```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **job_file:** Job file to search for prompts.

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

## ForceLogOff

ForceLogOff will automatically log off any user that is logged into a specific SYM.

Usage: ```/ops/bin/ForceLogOff sym#```

* **sym#:** Make sure the sym number is a three-digit number (e.g., 100).

:::tip Example

/ops/bin/ForceLogOff 000

:::

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |

:::warning

If user(s) are running any Episys jobs interactively, running this command can lock up the database requiring a reload of the sym. For a more complete explanation, refer to [Canceling an RSJ Job](operations/canceling-rsj-job).

:::

## install_dates

install_dates will install all necessary files in all SYM's for proper RSJ configuration. Additionally, it will add the jobfile ```SMA_DATES.JOB``` after all ```%PROGRAM CLOSEDAY and %JOBFILE CLOSEDAY``` occurrences in all job files in the ```/SYM/SYMnnn/BATCH``` directories.

Usage: ```/ops/bin/install_dates```

### Return Codes and Descriptions

| Returns | Descriptions |
| ------- | ------------ |
| 0 | Successful completion|
|10 | On a gross error |

## integrate_message

integrate_message will update an Episys job file prompts with responses from a note file. It is primarily used when a "\n" must be inserted into a job file.

 Usage: ```/ops/bin/integrate_message /SYM/SYMnnn/BATCH/SOME_BATCH_JOB /```

```full_path_to_notefile [occurrence]```

SOME_BATCH_JOB is the fully qualified path to an Episys batch job file.

NOTEFILE is the fully qualified path to the notefile containing both the prompts and updated responses. The notefile has the same format as a batch job.

Occurrence is an optional parameter that indicates which occurrence of the prompt that the program should start substituting at. The default is 1. Note that only the first prompt in the NOTEFILE is used as an index guide for the occurrence logic.

### Return Codes and Descriptions

| Returns | Descriptions |
| ------- | ------------ |
| 0 | Successful completion|

## LookForReportInRSJ

:::info Note

This utility is the prefered way to locate your Reports when searching for them on your Symitar system.

:::

LookForReportInRSJ looks for the sequence number of a report or output file from the BatchOutput file in the ```/SYM/SYM###/opcon_reports/``` ```<file name>``` directory. Since the ```<file name>``` subdirectory is searched, the Batch Output file must have been created as a result of running Episys. If the report being searched for was NOT created from RSJ, use LookForReportSequenceInReports. 

This sequence number is used to set a token that is used as an argument for other applications in downstream processing. This version does not verify that the sequence file is a text file or that it has a minimum number of bytes. 

For additional information that applies to Episys Details with LookForReportInRSJ in the Start Image, refer to [Episys: Find Report from RSJ Output](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-find-report-from-rsj-output) in the Concepts online help.

* This script is called with seven (or optionally 8) arguments:
    * The first argument is the three-digit SYM number.
    * The second argument is the name of the subdirectory to search (it will be the file name that was used when RSJ was invoked).
    * The third argument is the name of the report whose sequence number is of interest.
    * The fourth argument is the token to set.
    * The fifth argument is to the MSGIN directory of the LSAM.
    * The sixth argument is the OpCon user-id to use for the event. This user-id must have the "Maintain Tokens" permission.
    * The seventh argument is the external password of the OpCon user-id. Place this argument in double quotes.
    * The eighth argument is occurrence of the title to search for. This is an optional argument. If nothing is specified the first * occurrence is found.

:::tip Example

/ops/bin/LookForReportInRSJ nnn GOODNIGHT "SOME REPORT" TOKEN_NAME /usr/local/lsam/MSGIN ocadm "********************"

:::

:::info Note

LookForReportInRSJ will pull from the BatchOutput file to get the sequence number. The BatchOutput file is not created until a Symitar Batch Job is completed, which means none of these utilities will work correctly until the Symitar Batch Job that creates the report has finished.

:::

### Return Codes and Descriptions

| Returns | Descpritions | 
| ------- | ------------ | 
| 0 | No error |
| -1 | No sym number specified - aborting |
| -2 | No report directory specified - aborting |
| -3 | No report name specified - aborting |
| -4 | No token name specified - aborting |
| -5 | No MSGIN path specified - aborting |
| -6 | No OpCon User specified - aborting |
| -7 | No OpCon User password specified - aborting |
| -8 | Invalid MSGIN specified - aborting |
| -9 | Invalid Report Directory - aborting |
| -10 | Specified report not found - aborting |

## LookForReport

:::info Note

This program is to be used in the small cases where LookForReportiInRSJ cannot find the report.

:::

LookForReport looks the sequence number of a batch output file or report in /SYM/SYM###/REPORT directory (where ### is the 3-digit SYM number).

When LookForReport finds the file it is searching for, it will pass the file name (sequence number) back to the OpCon server to be stored in a property using MSGIN.

This program takes a variable number of arguments based on what is being searched for. The first required six arguments alone will simply find the last batch output file for the job being searched for.

The optional seventh argument will find an individual output report located within that batch output report.

The optional eight argument (which requires the seventh argument be present) will find the occurrence of the Report Name used in the seventh argument. It will search the batch output from top to bottom, with the top-most occurrence being 1.

:::info Note

This will find only the last occurrence of the batch output file. If the batch output file exists but the Report Name does not, the program will fail. If the Symitar job is run multiple times per day, this job should be executed immediately after the job run output is required from.

:::

:::info Note

The program will work on both jobs run from within RSJ and output of RSJ.

:::

##### Arguments:

* The first argument is the 3-digit SYM number
* The second argument is the Symitar jobfile that produced the batch output
* The third argument is the Property name that the program will pass the sequence number into
* The fourth argument is the path to the MSGIN directory on the local AIX machine
* The fifth argument is the OpCon external event user
* The sixth argument is the OpCon external event password
* (Optional) The seventh argument is the Report name to find within the batch output
* (Optional) The eight argument is the occurrence of the Report name to find within the batch output.

:::tip Example

/ops/bin/LookForReport nnn "SYMITAR_JOBFILE" "PROPERTY_NAME" /usr/local/lsam/MSGIN

ocadm "ocadm_password"

:::

:::tip Example

/ops/bin/LookForReport nnn "SYMITAR_JOBFILE" "PROPERTY_NAME" /usr/local/lsam/MSGIN

ocadm "ocadm_password" "REPORT_NAME" 3

:::

### Return Codes and Descriptions

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

optical_transfer is a program that will take a list of files to be archived (via a special Symitar repgen) and move them to an optical disk (or archival storage) via FTP. The basic steps to automate this process are:

1. Create a letterfile FTP.REPORTS (or if in use create FTP.REPORTS.OPCON).
2. Modify letterfile to exclude or include reports as needed. (i.e., to include Data files and Notices: +\+Data\+Notices).
3. Create Episys job to run the repgen.
4. Create Schedule in OpCon.
5. Create the following jobs in OpCon (and set frequencies and dependencies):
    * Create a job to run repgen.
    * Create a job to find sequence number of the report produced.
    * Create job to run the optical_report program.
6. From the Episys box, manually attempt to FTP to the optical box. This one step will save everyone a lot of grief. It is meaningless if you can perform a rsh, rcp, ssh, telnet, remote terminal session, or some fancy FTP gui from another machine. This test is only meaningful if you attempt the FTP login from the appropriate SYMITAR box. This will perform the same procedure that optical_transfer will have to perform and is a lot easier to debug. Validate that the credentials work and that whatever the FTP server is setting the default path [to be] is acceptable (and/or revise the remote path on the optical_transfer command line). To perform a command line FTP, create a telnet session to the Symitar box and issue the command "ftp your_optical_machine_name". The program will prompt for the username and password. On most FTP servers, the "pwd" command is present which will show the current working directory. If it is not available, then perform the "dir" command and start searching the remote file system for a matching directory via tools on the remote FTP host.

Usage: ```/ops/bin/optical_transfer sym# sequence_number ftp_username ftp_password ftp_hostname[:port] ftp_directory_to_place_files [ftp_extension_to_append]```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **sequence_number:** The name of the report file containing the list of reports to archive.
* **ftp_username:** The remote ftp user name.
* **ftp_password:** The remote ftp password.
* **ftp_hostname:** The remote ftp machine. Note that an optional port number can be appended with the syntax :port_number. FTP servers are typically located on port 21.
* **ftp_directory:** Where to place the files on the remote machine. Remember that this is relative to the default path setup in the FTP server. Oftentimes, this is not the default path that one would expect.
* **ftp_extension_to_append:** An optional extension to append to all transferred files.

## print_batch

print_batch will print the Batch Output report generated from the most recent OpCon run of a Symitar Batch job. The utility must run separately for each Batch Output report desired.

Usage: ```/ops/bin/print_batch opcon_reports_directory print_queue_name```

* opcon_reports_directory: The full path to the directory containing the Batch Output report for a Symitar Batch job run through OpCon.
* print_queue_name: The name of the UNIX print queue to print to.

:::tip Example

/ops/bin/print_batch /SYM/SYM000/opcon_reports/GOODNIGHT lp0

:::

This will the batch Output report from the most recent time OpCon ran the GOODNIGHT Symitar Batch job.

## qb_sma

qb_sma will display all jobs running in batch queues as well as any interactive RSJ jobs. This command is very similar to the Symitar command qb.

Usage: ```/ops/bin/qb_sma```

## restore_backup_reports

restore_backup_reports is a program that will restore a file made by backup_reports. It will place the files in the /SYM/SYM###/opcon_reports directory (the ### is the three-digit SYM number). It is the user's responsibility to remove any unneeded/unwanted files once they have been restored. The file_name should be an actual file name and not a fully qualified path. The program will automatically prepend the correct path to the file_name.

Usage: ```/ops/bin/restore_backup_reports sym# file_name```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **file_name:** The file name to restore.

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | Successful completion |
| 11 | Did not pass in sym# |
| 15 | Bad sym format |
| 16 | Sym does not exist |
| 17 | Illegal file extension passed to restore |
| 18 | Restore file does not exist |
| 19 | Unable to restore files |

## SetServiceStatus

This script is called with three arguments:

1. The first argument is the service name to control, and the allowable service names are:
    * AUTOBATCH
    * SYMCONNECT
    * AUDIO
    * ATM
    * CREDIT
2. The second argument is the three-digit sym number (nnn).
3. The third argument (status) must either be ONHOST or OFFHOST.

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | No error |
| 1 | No service name specified |
| 2 | No sym number specified |
| 3 | No status specified |
| 4 | Invalid service name specified |
| 5 | Invalid status specified |

## sma_copyjob

sma_copyjob will prepend the name sma_ to a nested job file and create a new job. This will allow safe editing (prompt setting) of the new job without affecting the original job.

Usage: ```/ops/bin/sma_copyjob SYM# job_file```

* **SYM#:** The sym number of the desired sym (e.g., SYM000, SYM100, or SYM999).
* **job_file:** Provides the job file name.

### Return Codes and Descriptions

| Returns | Description |
| ------- | ---------- |
| 0 | Successful completion |

:::info Note 

Episys has a 32-character limit on job names. This program can and will exceed this limitation. It is the user's responsibility to perform the appropriate renaming/editing of the affected job file(s).

:::

## SMA_DATES.JOB

SMA_DATES.JOB is a Symitar batch job that updates the SMA_DATES file that is used by RSJ to obtain the current processing date. Refer to in the RSJ Installation section for additional information. This program should be executed by RSJ whenever the processing day changes, or when the program install dates has been executed.

## SMADump_scf

The SMADump_scf application is used to easily display spaces and non-printable characters in Symitar control files. The command line requires the name of the control file.

### Command Line Options

| Return | Descriptions |
| ------ | ------------ |
| -f | full_path_to_file input file to display |
| -v | If everything works correctly, SMADump_scf exits |

:::tip Example 

/ops/bin/SMADump_scf -f/SYM/SYM000/BATCH/CC.LATE.FEE

:::

### Return Codes and Descriptions

| Return | Descriptions |
| ------ | ------------ |
| -1 | If there are any errors, SMADump_scf exits |
| 0 | If everything works correctly, SMADump_scf exits |

Possible SMADump_scf errors are:

* Command line is incorrectly formatted.
* Unable to read or write the specified file.


## sma_hostinfo

sma_hostinfo is a UNIX program that generates all information needed to license the RSJ program. It should be run by root in a telnet session and the file sma_info sent to [license@smatechnologies.com](mailto:license@smatechnologies.com).

1. From the # symbol in Episys, issue the following commands:
    * ```cd /ops/bin```
    * ```/ops/bin/sma_hostinfo```
2. Send the file ```/ops/bin/sma_info``` to [license@smatechnologies.com](mailto:license@smatechnologies.com).

## translate2commas

The translate2commas utility is used as a "wrapper" around update_scf. It is used to translate the ^ character to a comma. This allows tokens (that originally contained commas) to be used with events.

:::tip Example

The token called IRAGROUP contains the data that is needed to set the response to a prompt. However, this data is delimited by the ^ character instead of by a comma and must be translated.

/ops/bin/translate2commas /ops/bin/update_scf
-f/SYM/SYM999/BATCH/DEFERRED.COMP.DISTRIB.CHECKS
"Group List: [[IRAGROUP]]"

::: 

## update_scf -- Update Symitar Control File (Response File)

update_scf is used to update the Symitar control files (job files). The command line requires the name of the control file, one or more pairs of prompts, and the value for that prompt. For additional information that applies to Episys Details with update_scf in the Start Image, refer to [Episys: Answer Prompts](http://help.smatechnologies.com/opcon/core/job-types/unix#episys-answer-prompts) in the Concepts online help.

### Command Line Options

| Returns | Description |
| ------- | ----------- |
| -f full_path_to_file | Specify file name to use |
| -s | Only modify the first match (otherwise modify all matches) |
| -v | Print out version number |

:::tip Example 

/ops/bin/update_scf -f/SYM/SYM000/BATCH/CC.LATE/FEE

"Effective Date:[[11After25thEff]]" "Date:047"

:::

:::info Note

By default, update_scf will modify all prompts that have that exact prompt. To only modify the first one, use the -s switch.

:::

### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| -1 | If there are any errors, update_scf exits |
| 0 | If everything works correctly, update_scf exits |

Possible update_scf errors are:

* Command line is incorrectly formatted.
* Unable to read or write the specified file.
* Too many prompt/value pairs specified.

## Legacy

### LookForBatchOutputSequence

:::info Note

This utility has been deprecated and will be omitted from a future version of RSJ. Use Look For Report instead.

:::

LookForBatchOutputSequence looks for the file name from the latest BatchOutput file in the ```/ SYM/SYM###/opcon_reports/<file name> ``` directory (the ### is the three-digit SYM number). Since the ```<file name>``` subdirectory is searched, the Batch Output file must have been created as a result of running RSJ. This sequence number is used to set a token that is used as an argument for other applications in downstream processing. 

Generally, it is better to use LookForReportInRSJ. This program will verify that the sequence file is greater than 255 bytes and is a text file. For additional information that applies to Episys Details with LookForBatchOutputSequence in the Start Image, refer to [Episys: Find Batch Output Sequence Number](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-find-batch-output-sequence-number) in the Concepts online help.

* This script is called with six arguments:
    * The first argument is the three-digit SYM number.
    * The second argument is the name of the subdirectory to search (it will be the job name that was used when RSJ was invoked).
    * The third argument is the token to set.
    * The fourth argument is the fully qualified path to the MSGIN directory of the LSAM.
    * The fifth argument is the OpCon user-id to use for the event. This user-id must have the "Maintain Tokens" permission.
    * The sixth argument is the external password of the OpCon user-id. Place the password in double quotes.

:::tip Example

/ops/bin/LookForBatchOutputSequence nnn GOODNIGHT TOKEN_NAME /usr/local/lsam/MSGIN ocadm

:::

:::info Note

LookForBatchOutputSequence will look for the actual BatchOutputFile. 

This utility will not be able to locate the file until the job that creates it completed.

:::

#### Return Codes and Descriptions

|Returns | Description |
| ------ | ----------- |
| 0 | No error |
| -1 | No sym number specified - aborting |
| -2 | No report directory specified - aborting |
| -3 | No report name specified - aborting |
| -4 | No token name specified - aborting |
| -5 | No MSGIN path specified - aborting |
| -6 | No OpCon User specified - aborting |
| -7 | No OpCon User password specified - aborting |
| -8 | Invalid MSGIN specified - aborting |
| -9 | Invalid Report Directory - aborting |
| -10 | Specified report not found - aborting |

### LookForReportSequence

:::info Note

This utility has been deprecated and will be omitted from a future version of RSJ. Use LookForReport instead.

:::

LookForReportSequence looks for the sequence number of a report or output file from the BatchOutput file in the ```/SYM/SYM###/opcon_reports/<file name>``` directory (the ### is the three-digit SYM number). 

Since the ```<file name>``` subdirectory is searched, the Batch Output file must have been created as a result of running RSJ. If the report being searched for was NOT created from RSJ, use LookForReportSequenceInReports. 

This sequence number is used to set a token that is used as an argument for other applications in downstream processing. Generally, it is better to use LookForReportInRSJ. 

This program (LookForReportSequence) will verify that the sequence file is greater than 255 bytes and is a text file. 

For additional information that applies to Episys Details with LookForReportSequence in the Start Image, refer to [Episys: Find Report from RSJ Output](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-find-report-from-rsj-output) in the Concepts online help.

* This script is called with seven (or optionally 8) arguments:
    * The first argument is the three-digit SYM number
    * The second argument is the name of the subdirectory to search (it will be the job file name that was used when RSJ was invoked)
    * The third argument is the name of the report whose sequence number is of interest. Place the report name in double quotes.
    * The fourth argument is the token to set.
    * The fifth argument is the fully qualified path to the MSGIN directory of the LSAM.
    * The sixth argument is the OpCon user-id to use for the event. This user-id must have the "Maintain Tokens" permission.
    * The seventh argument is the external password of the OpCon user-id. Place the password in double quotes.
    * The eighth argument is occurrence of the title to search for. This is an optional argument. If nothing is specified the first occurrence is found. This argument should be a number greater than or equal to 1.

:::tip Example

/ops/bin/LookForReportSequence nnn GOODNIGHT "SOME REPORT"

TOKEN_NAME /usr/local/lsam/MSGIN ocadm "********************"

:::

:::info Note

LookForReportSequence will pull from the BatchOutput file to get the sequence number. The BatchOutput file is not created until a Symitar Batch Job is completed, which means none of these utilities will work correctly until the Symitar Batch Job that creates the report has finished.

:::

#### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | No error |
| 1 | No sym number specified - aborting |
| -2 | No report directory specified - aborting |
| -3 | No report name specified - aborting |
| -4 | No token name specified - aborting |
| -5 | No MSGIN path specified - aborting |
| -6 | No OpCon User specified - aborting |
| -7 | No OpCon User password specified - aborting |
| -8 | Invalid MSGIN specified - aborting |
| -9 | Invalid Report Directory - aborting |
| -10 | Specified report not found - aborting |


### LookForReportSequenceInReports

:::info Note

This utility has been deprecated and will be omitted from a future version of RSJ. Use LookForReport instead.

:::

LookForReportSequenceInReports looks for the sequence number of a report or output file from the BatchOutput file in the ```/SYM/SYM###/REPORT``` directory (the ### is the three-digit SYM number). This enables the action to find sequence numbers of reports that were not created from RSJ. 

This sequence number is used to set a token that is used as an argument for other applications in downstream processing. This program will verify that the sequence file is greater than 255 bytes and is a text file. 

This program has an additional restriction that the output must be present for the correct day (i.e., if you search for a file that was created yesterday, but not today it will find yesterdays file). 

For additional information that applies to Episys Details with LookForReportSequenceInReports in the Start Image, refer to [Episys: Find Report from Episys Reports](https://help.smatechnologies.com/opcon/core/job-types/unix#episys-find-report-from-episys-reports) in the Concepts online help.

* This script is called with six (or optionally 7) arguments:
    * The first argument is the three-digit SYM number
    * The second argument is the name of the report whose sequence number is of interest. Place the report name in double quotes.
    * The third argument is the token to set.
    * The fourth argument is the fully qualified path to the MSGIN directory of the LSAM.
    * The fifth argument is the OpCon user-id to use for the event. This user-id must have the "Maintain Tokens" permission.
    * The sixth argument is the external password of the OpCon user-id. Place the password in double quotes.
    * The seventh argument is occurrence of the title to search for. This is an optional argument. If nothing is specified the first occurrence is found. This argument should be a number greater than or equal to 1.

:::tip Example

ops/bin/LookForReportSequenceInReports nnn "REPORT NAME" TOKEN_NAME /

usr/local/lsam/MSGIN ocadm

:::

:::info Note

LookForReportSequenceInReports will pull from the BatchOutput file to get the sequence number. The BatchOutput file is not created until a Symitar Batch Job is completed, which means none of these utilities will work correctly until the Symitar Batch Job that creates the report has finished.

:::

#### Return Codes and Descriptions

| Returns | Description |
| ------- | ----------- |
| 0 | No error | 
| -1 | No sym number specified - aborting |
| -2 | No report directory specified - aborting |
| -3 | No report name specified - aborting |
| -4 | No token name specified - aborting |
| -5 | No MSGIN path specified - aborting |
| -6 | No OpCon User specified - aborting |
| -7 | No OpCon User password specified - aborting |
| -8 | Invalid MSGIN specified - aborting |
| -9 | Invalid Report Directory - aborting |
| -10 | Specified report not found - aborting |


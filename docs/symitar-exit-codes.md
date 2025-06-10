# Symitar Exit Codes

## Batch Codes and Return Code Descriptions

### 000 - Job successful
* Job completed successfully with no known errors.

### 001 - Fatal

* Job called the Fatal procedures, most often due to dependencies of the batch job processing not being met. 
* 001 Fatal will override any other Batch Return Code in the event another error condition is also encountered.

### 002 - Job not completed successfully

* Job did not complete successfully, but no known Batch Return Code was returned. This could happen if a user terminated the current batch job.

### 003 - File Missing

* Job did not find a file that it needed for processing. This will be output for the following: ACH Posting, ATM Posting, Card Posting, Draft Posting, Insurance Posting, Fee Posting, Miscellaneous Posting, Edit Runs, and the Account Number Change batch program.

### 004 - Inconsistent answers to batch questions

* Job has some batch prompts answered in a manner that is inconsistent with other batch prompt answers.

### 005 - Terminated due to error

* A syntax error occurred while the internal structure was interpreting the PowerOn specfile. Exclusive to PowerOn specfiles.

### 006 - Terminated remainder of batch job

* Job experienced an error and terminated the remainder of processing.

### 007 - Report terminated due to TERMINATE specs

* Job experienced an error and called the TERMINATE command. Exclusive to PowerOn specfiles.
* This code is normally returned in one of two conditions from a PowerOn (repgen) program. The main issue is that Symitar uses the same subroutine "TERMINATE" for both a normal exit and an error exit. Users will need to investigate which situation applies:
  * Job experienced some fatal non-recoverable condition.
  * Job needed to exit early because it finished its calculations.

### 008 - Array out of bounds

* The total number of arrays and characters in quoted text is too high. Exclusive to PowerOn specfiles.
* This code is returned as a result of a PowerOn (repgen) coding error. Normally users will receive an output file but the results will either be incorrect or the report will contain partial data. It is advisable to correct the programming error.

### 009 - While limit exceeded

* If PowerOn reaches the WHILELIMIT maximum, it terminates and displays an error message on the batch output report and at the end of the report or screen display: Exclusive to PowerOn specfiles.
* This code is normally returned as a result of a logical PowerOn (repgen) coding error.
* The default WHILELIMIT is 1,000,000. If a PowerOn program while loop exceeds this number of iterations, the program will abort. The results will either be incorrect or the report will contain partial data. Having excessive looping will result in long report times. Most PowerOn programs should never have this error. In the event the program actually needs a while loop with more than 1,000,000 iterations, please change the WHILELIMIT.

### 010 - Edit Run aborted

* Any errors currently coded in the EDITRUNABORT command will receive this Batch Return Code. Exclusive to Edit Runs.

### 100 - Edit Run aborted

* There are three possibilities for exit code 100:
  * System could be out of space.
  * System needs to be rebooted.
  * RSJ unable to access resource due to system cache issue.


## RSJ Detection of Symitar Errors

RSJ will detect some (but not all) Symitar errors without additional configuration. If RSJ detects a Symitar fatal error, it will halt all processing of the job. This detection does not depend upon the new Symitar error codes - it is in addition to the exit code logic. (Symitar released a new version of Episys that returns error codes in late 2007.) If an error is found that is not being trapped (and should be), open a Support Ticket via the [Support Portal](https://smatech2.my.site.com/SMASupportPortal/s/) with a quick note explaining what the error is and why it is occurring. Please mention that this is a Symitar error that should be forwarded to development.

Some of the other error codes can be triggered as a result of being run in a test sym or on a test machine. It is common for RSJ to stop on job files that have been running in production shops (particularly if the jobs are running in test mode). SMA Technologies is finding that the errors are either unknown or have just been ignored. SMA Technologies recommends taking time to investigate all problems that are found. Once this process is complete, RSJ will typically run without stopping. If it is desired to stop error checking, use the following commands at the start of the job file:

```;MAX_EXCEPTIONS 20000000```

```;ERROR_LEVEL 999```

## Symitar Error Processing Changes

In the summer of 2010, Symitar informed SMA Technologies that it would begin to use more than the normal 1-10 error codes. Symitar's Chief Architect requested SMA Technologies to change its default error processing to stop on all errors. The 1.30.0012 release of RSJ provides this change. Customers who installed previous versions of RSJ will need to revisit this issue in all of their job files and all SMA_DEFAULT files.


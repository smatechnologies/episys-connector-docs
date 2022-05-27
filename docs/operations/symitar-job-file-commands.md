# Symitar Job File Commands

## CREATE_OPCON_REPORTS_LINKS

CREATE_OPCON_REPORTS_LINKS can be set in the SMA_DEFAULTS file (or set in any batch file - like the other RSJ directives to selectively turn on and off link creation). The default value is "true."

:::tip Example 

;CREATE_OPCON_REPORT_LINKS true | false

:::


## ERROR_LEVEL

:::info Note

The ERROR_LEVEL directive is only available from SMA Technologies. Symitar does not support the ERROR_LEVEL directive.
 
:::

An error level is the set of return codes that will cause SMA Technologies to stop processing the current Symitar Batch Jobfile (nested or not). The error level directive is inserted into a comment of a Symitar Batch Job. It has the following form:

```;Error_LEVEL 1,5-10,10-12,21```

* This command states that if the program return code is in the set of 1, 5, 6, 7, 8, 9, 10, 11, 12, or 21, SMA Technologies should immediately stop processing the job. In previous versions (1.30.0008 and below), the default error level would stop on codes 1 through 10. Symitar has revised their advice and recommend that all errors be trapped since they are using more error codes now. All new installations will have this as the default (1-255). Any upgrades of RSJ should revisit which errors are trapped.

* The current best practice is to only put error level checking at the beginning of a job file. This allows everyone to easily determine what level of error checking is in effect.

* The other common option is to bracket a program with ERROR_LEVEL statements.
White pencil icon on green circular background	


:::tip EXAMPLE 

;skip checking for error code 9

;ERROR_LEVEL 1-8, 10

%PROGRAM REPGEN

prompt : answer

;ERROR_LEVEL 1-10

:::

While the above syntax is technically correct, it can fail if users use a Symitar editor to edit the job file (the comment lines containing RSJ commands will be reordered). The ERROR_LEVEL commands should be placed into separate files (TURN_OFF_CHECKING and TURN_ON_CHECKING) so that the Episys job file editors cannot reorder the comment lines.

:::tip Example

;skip checking for error code 9

%JOBFILE TURN_OFF_CHECKING

%PROGRAM REPGEN

prompt : answer

%JOBFILE TURN_ON_CHECKING

:::

## FAIL_ON_PERSISTENT_EDITFILE

FAIL_ON_PERSISTENT_EDITFILE can be set in the SMA_DEFAULTS file (or set in any batch file - like the other RSJ directives to selectively turn on and off this features). The default value is "false." If the job to be executed requires EDITFILE.DATA, but EDITFILE.DATA exists, RSJ will wait for MINUTES_TO_WAIT_FOR_EDITFILE (default is 10 minutes). After this time has elapsed (and if EDITFILE.DATA still exists), RSJ will fail if this setting is true. If this setting is false, it will operate as it has in the past and simply move the EDITFILE.DATA to a temporary area.

:::tip Example

; FAIL_ON_PERSISTENT_EDITFILE true | false

:::

## JAVA_HOME

JAVA_HOME can only be set in the SMA_DEFAULTS file. The environment variable called JAVA_HOME will be set to this value and JAVA_HOME/bin will be added to the path. The default value is /usr/java6.

:::tip Example

; JAVA_HOME "/usr/java7"

:::

## MAX_EXCEPTIONS


:::info Note 

The MAX_EXCEPTIONS directive is only available from SMA Technologies. Symitar does not support the MAX_EXCEPTIONS directive.

::: 

MAX_EXCEPTIONS is the maximum number of exceptions pages that are allowed. If the number of exception pages goes over this limit, the job will be terminated. The max exceptions directive is inserted into a comment of a Symitar Batch Job. It has the following form:

```;MAX_EXCEPTIONS 8```

* The default is 0 (any exceptions will cause the job to terminate).
* The current best practice is to only put MAX_EXCEPTIONS checking at the beginning of a job file.
* This allows everyone to easily determine what level of exception checking is in effect.
* The other common option is to bracket a program with MAX_EXCEPTIONS statements.

:::tip Example

;skip exception checking

;MAX_EXCEPTIONS 2000000

%PROGRAM REPGEN

prompt : answer

;MAX_EXCEPTIONS 0

::: 

While the above syntax is technically correct, it can fail if users use a Symitar editor to edit the job file (the comment lines containing RSJ commands will be reordered). The MAX_EXCEPTIONS commands should be placed into separate files (TURN_OFF_CHECKING and TURN_ON_CHECKING) so that the Episys job file editors cannot reorder the comment lines.

:::tip Example

;skip checking for MAX_EXCEPTIONS

%JOBFILE TURN OFF_CHECKING

%PROGRAM REPGEN

prompt : answer

%JOBFILE TURN_ON_CHECKING

TURN_OFF_CHECKING

;MAX_EXCEPTIONS 2000000

TURN_ON_CHECKING

;MAX_EXCEPTIONS 0

:::

## MINUTES_TO_WAIT_FOR_EDITFILE

MINUTES_TO_WAIT_FOR_EDITFILE can be set in the SMA_DEFAULTS file (or set in any batch file - like the other RSJ directives to set the value for this feature). The default value is "10 minutes". If the job to be executed requires EDITFILE.DATA, but EDITFILE.DATA exists, RSJ will wait for MINUTES_TO_WAIT_FOR_EDITFILE (default is 10 minutes). After this time has elapsed (and if EDITFILE.DATA still exists), RSJ will either fail (if FAIL_ON_PERSISTENT_EDITFILE is true) or move the EDITFILE.DATA file to a temporary area (if FAIL_ON_PERSISTENT_EDITFILE is set to false).

:::tip Example

; MINUTES_TO_WAIT_FOR_EDIT_FILE     5 

:::

## RESTART_POINT

:::info Note

Restart points are only available from SMA Technologies. Symitar does not support them and has not implemented them.

:::

A restart point allows a user to restart a job at a particular point (in the event of failure). A restart point can be specified in a nested job which enables jobs to be ignored before the restart point and continue with the rest of the processing. A restart point is inserted as a comment in a Symitar Batch Job. It has the following form:

```;RESTART_POINT some_name_n```

:::info Note

Spelling and Capitalization are very important. RSJ looks for the exact match on Restart Points. If an invalid restart_point is specified on the command line, no programs will be run and the job will return an error. Avoid the use of spaces and tabs in a restart_point name.

:::

* It is important that all restart points be unique in all nested jobs. SMA Technologies will only find the very first restart point of the specified name. Any duplicate restart point names will be ignored even if they are in different files.

* After running a job with a restart point, it is advisable to remove the restart point from the job. This will prevent a possible "name collision" should the job have a failure in another nested procedure sometime in the future.
White pencil icon on green circular background	

:::tip Example

### Sample Job File (REPGEN.JOB)

;RESTART_POINT REPGEN2

%PROGRAM REPGEN

prompt : answer

prompt2: answer
 
### Sample OpCon Command Line:

/ops/bin/RSJ 000 REPGEN.JOB REPGEN2

:::
 

While the above syntax is technically correct, it can fail if users use a Symitar editor to edit the job file (the comment lines containing RSJ commands will be reordered). The RESTART_POINT command should be placed into a separate file (PERMANENT_RESTART_POINT) so that the Episys job file editors cannot reorder the comment lines.

 

:::tip Example

### Sample Job (PERMANENT_RESTART_POINT.JOB)

;RESTART_POINT PERMANENT_RESTART_POINT

:::

:::tip Example

### Sample Job (JOB_THAT_NEEDS_RESTART_POINT.JOB)

%JOBFILE PERMANENT_RESTART_POINT.JOB

%PROGRAM REPGEN

prompt : answer

prompt2: answer

::: 

This technique will allow the use of a permanent restart point.

## SCRIPT

:::info Note

The SCRIPT directive is only available from SMA Technologies. Symitar does not support the SCRIPT directive.

::: 

SCRIPT is a directive that allows users to execute external scripts and programs inside a Symitar jobfile. The script directive is inserted into a comment of a Symitar Batch Job. It has the following form:

```;SCRIPT program arguments```

* The default return code will be examined to see if it is zero. Any non-zero exit code will cause RSJ to terminate.

* The program/script should be tested outside of the Symitar environment to make sure that it is functioning properly.

:::tip Example

%JOBFILE SOME_SCRIPT_JOB

File: SOME_SCRIPT_JOB

;SCRIPT program arguments

::: 

While the above syntax is technically correct, it can fail if users use a Symitar editor to edit the job file (the comment lines containing RSJ commands will be reordered). The SCRIPT command should be placed into a separate file (SCRIPT.JOB) so that the Episys job file editors cannot reorder the comment lines.

:::tip Example

### Sample Job (SCRIPT.JOB)

;SCRIPT SOME_SPECIAL_SCRIPT

::: 

:::tip Example

### Sample Job (JOB_THAT_NEEDS_SCRIPTS.JOB)

%JOBFILE SCRIPT.JOB

%PROGRAM REPGEN

prompt : answer

prompt2: answer

:::

This technique will allow the use of a permanent script command in a job file.

## SEND_OUTPUT_TO_QOUT

SEND_OUTPUT_TO_QOUT can be set in the SMA_DEFAULTS file (or set in any batch file - like the other RSJ directives to selectively turn on and off this feature). The default value is "false."

:::tip Example

;SEND_OUTPUT_TO_QOUT true | false

:::

SAJ always sends the output to QOUT. There is no directive to control this.

## Generalized Exception Handling - EXCEPTION_REPORT

EXCEPTION_REPORT is the command to cause RSJ to terminate if any matching report has too few pages in it or too many pages in it. The report name may contain a wildcard "*" to match multiple reports. Once an EXCEPTION_REPORT directive is defined, it is active for the remainder of the job file or until an EXCEPTION_REPORT_CLEAR directive is encountered. This command allows for the matching of any report whereas the MAX_EXCEPTIONS directive only matches EDIT exceptions. Symitar has at least seven different forms for exceptions which is why a generalized approach is necessary to allow control over all possible exception forms.

* The exception_report directive is inserted into a comment of a Symitar Batch Job and has the form:

```;EXCEPTION_REPORT "REPORT NAME" #_of_pages LT|LE|GT|GE```

:::info Note 

The quotes around report name are mandatory. There are no defaults for this command because it is turned off by default.

:::

* The first argument is the name of the report(s) to match. The quotes around the report name are mandatory. By default, if a "*" is encountered it is assumed to be a wildcard that matches any characters. If the "*" is actually part of the report name place a "\" in front of the "*" (i.e., "\*") - this turns off the wildcard matching.

* The second argument is the number of pages in the report that should be used in the comparison (i.e., too few pages or too many pages).

* The third argument is one of four comparison operators (LT, LE, GT, GE) which is the operator to use in the number of pages comparison. LT is the less than operator. LE is the less than or equal operator. GT is the greater than operator.

* The EXCEPTION_REPORT directive is only available from SMA Technologies, Symitar does not support the EXCEPTION_REPORT directive.

:::info Note

The quotes around report name are mandatory. There are no defaults for this command because it is turned off by default.

:::

* The current best practice is to only put EXCEPTION_REPORT checking at the beginning of a job file. This allows everyone to easily determining what level of exception checking is in effect.


:::tip Example

;Error if any report name ending in EXCEPTION is >= 10 pages

;EXCEPTION_REPORT "* EXCEPTION" 10 GE

;Error if any report name starting with EXCEPTION is >= 10 pages

;EXCEPTION_REPORT "EXCEPTION *" 10 GE

;Error if report TEST is < 10 pages

;EXCEPTION_REPORT "TEST" 10 LT

:::

## Generalized Exception Handling - EXCEPTION_REPORT_CLEAR

EXCEPTION_REPORT_CLEAR is the command to cause RSJ to clear or "forget" all previous EXCEPTION_REPORT directives. The exception_report_clear directive is inserted into a comment of a Symitar Batch Job and has the form:

```;EXCEPTION_REPORT_CLEAR```

* There are no defaults for this command because it is turned off by default.

* The EXCEPTION_REPORT_CLEAR directive is only available from SMA Technologies. Symitar does not support the EXCEPTION_REPORT_CLEAR directive.

:::tip Example

;Clear all previous EXCEPTION_REPORT directives

;EXCEPTION_REPORT_CLEAR

:::

* RSJ Default Values are:
    * ;ERROR_LEVEL 1-255
    * ;MAX_EXCEPTIONS 0

## DIE_NO_ERROR_CODE

The directive DIE_NO_ERROR_CODE directs RSJ to stop processing if no Symitar error code is found. There are some Symitar programs that die unexpectedly without producing an error code and others that do not output error codes in all cases. This directive was requested by Symitar so all shops are highly encouraged to use it. The recommended place for this directive is in the SMA_DEFAULTS file. A value of TRUE turns the logic on and a value of FALSE turns the logic off. The default value is TRUE.

Usage:

```;DIE_NO_ERROR_CODE [TRUE|FALSE]```

## FATAL_MESSAGE

The directive FATAL_MESSAGE adds a new string that RSJ will search for to determine if processing should stop. This capability is to cover situations where Symitar has an error message that is not caught by RSJ error handling (i.e., a new release or the discovery of a new error message that is not handled properly). Normally, this directive should be placed in the SMA_DEFAULTS file. Note that these messages are case-sensitive. If someone comes across a new error message that should be caught, please send it to SMA Technologies.

The following messages are turned on by default in RSJ (these messages are recommended to be caught by Symitar):

* This batch stream is now terminated
* Inconsistent answers to batch questions
* Entire Batch Job File Terminated!
* CURRENT BATCH JOB TERMINATED
* REMAINDER OF BATCH JOB FILE TERMINATED
* System Is Not Available
* Error 13: Permission denied
* System logon problem
* Unspecified error result code of
* DISKBACKUP FAILED
* Terminated remainder of batch job

Usage:

```;FATAL_MESSAGE "message string"```

## FATAL_MESSAGE_CLEAR

The directive FATAL_MESSAGE_CLEAR removes all fatal error messages (including the default ones). This allows credit unions to fully customize error handling. Normally, this directive should be placed in the SMA_DEFAULTS file. It is highly recommended that this directive not be used. If it is used, then the FATAL_MESSAGE directive must be used to add any desired Symitar messages to stop RSJ upon since there won't be any messages left to stop on.

Usage:

```;FATAL_MESSAGE_CLEAR```

## SMA_DEFAULTS

The file SMA_DEFAULTS is stored in /SYM/SYMnnn/BATCH. It is a completely optional file. If the file is present, RSJ will read this file before it starts processing on the users job file. Users can place SMA Technologies' directives in it to customize error handling. The directives that can be placed in the file are:

;EXCEPTION_REPORT

* ;EXCEPTION_REPORT

* ;EXCEPTION_REPORT

* ;EXCEPTION_REPORT_CLEAR

* ;ERROR_LEVEL

* ;MAX_EXCEPTIONS

* ;DIE_NO_ERROR_CODE

* ;FATAL_MESSAGE

* ;FATAL_MESSAGE_CLEAR

* ;CREATE_OPCON_REPORTS_LINKS

* ;FAIL_ON_PERSISTENT_EDITFILE

* ;JAVA_HOME

* ;MINUTES_TO_WAIT_FOR_EDITFILE

* ;SEND_OUTPUT_TO_QOUT

If any other commands or comments are found in this file they will be ignored.

:::warning 

This file will be read and executed for all job files to be run. Make sure that reasonable/wanted values are set for error processing. To override these defaults for a single job, you will need to place the desired error processing commands at the start of the job file.

:::
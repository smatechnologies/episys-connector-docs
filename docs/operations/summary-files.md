# Summary Files

Users have requested a mechanism to make it easier to analyze the batch output of a job (particularly jobs that create large batch output files). If the –s option is used on the command line, a summary file configuration file can be specified. For example:

```-s/SYM/SYM000/LETTERSPECS/GoodnightSummaryConfig```

:::info Note 

The user under whom the job is being run must have read access to the specified file.

::: 

The job output will have messages added to show that this was specified. Note the messages in blue in the following example:

## Job Output File

:::tip Example 

```
RSJ Version=15.00.000
exe path=/ops/bin/RSJ15.00/RSJ=
argv[0]=/ops/bin/RSJ15.00.00/RSJ=
argv[1]=SYM000=
argv[2]=GOODNIGHT=
argv[3]=-s/SYM/SYM000/summaryconfig=
INFO Wed Mar 25 11:12:21 2015 Copyright@ SMA 2015=
INFO Wed Mar 25 11:12:21 2015 This code may not be transferred/lent/copied outside your organization without SMA approval=
INFO Wed Mar 25 11:12:21 2015 Summary Configuration file is =/SYM/SYM000/LETTERSPECS/GoodnightSummaryConfig=
INFO Wed Mar 25 11:12:21 2015 SYM=SYM000=
INFO Wed Mar 25 11:12:21 2015 Jobfile=GOODNIGHT=
INFO Wed Mar 25 11:12:21 2015 Restart Point was not input=
INFO Wed Mar 25 11:12:22 2015 default_file=/SYM/SYM000/BATCH/SMA_DEFAULTS=
....
%BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.
%COMPLETIONDATETIME 03/25/15 11:14:44
======================= COMPLETION OF BATCH PROCESSING ======================
INFO Wed Mar 25 11:14:45 2015 Closed jobfile ONLINE=
INFO Wed Mar 25 11:14:45 2015 Closed jobfile GOODNIGHT=
INFO Wed Mar 25 11:14:46 2015 SummaryFileName =[/SYM/SYM000/LETTERSPECS/GoodnightSummary]=
INFO Wed Mar 25 11:14:46 2015 opcon_message using environment this_path=/usr/local/lsam-05.20.30/bin=
INFO Wed Mar 25 11:14:46 2015 opcon_message using path=/usr/local/lsam-05.20.30/bin/sma_status=
INFO Wed Mar 25 11:14:46 2015 opcon_message= /usr/local/lsam-05.20.30/bin/sma_status "Waiting for LockFile"=
INFO Wed Mar 25 11:14:46 2015 all done=
```

::: 

Currently, there are only a couple of directives that can be specified.

 	
## Summary File Configuration File

:::tip Example

\#

SummaryFileName=/SYM/SYM000/LETTERSPECS/GoodnightSummary

SuppressZeroReturns=false

::: 

:::info Note 

The user under whom the job is being run must have write/create access to the specified file.
 
:::

| Directive | Description | 
| --------- | ----------- |
|SummaryFileName | This is the path and name of the file to be created. |
| SuppressedZeroReturns | This is a true or false field. If set to true, the BATCHRETURNCODE lines showing a return of 000 will not be included. |
 
After the job has finished running, the batch output file will be scanned and the summary file will be created.

 

## Summary File

:::tip Example

Summary file for : GOODNIGHT

Completion Date : 03/25/2015

SYM : SYM000

(00041) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.

(00133) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.

(00172) %BATCHRETURNCODE: 000 Job successful from Program: CLOSEDAY.

(00192) %BATCHRETURNCODE: 000 Job successful from Program: REPWRITER.

(SMA_DATES.RG)

(00236) %BATCHRETURNCODE: 000 Job successful from Program: REPWRITER.

(RB.DELETE.REPORTS)

(00277) %BATCHRETURNCODE: 000 Job successful from Program: BATCHHOSTCONTROL.

::: 

Most of the output is self-explanatory and is just extracted from the batch output file. The number shown in parenthesis is the line number from the batch output file where the line was found.

## Summary File when SuppressZeroReturns is set to true

:::tip Example

Summary file for : GOODNIGHT

Completion Date : 03/25/2015

SYM : SYM000

:::
 
:::info Note

Errors in configuration, access permissions, etc., will NOT cause the job to fail. Any errors will simply be logged in the output of the job and the summary file will not be created.

:::
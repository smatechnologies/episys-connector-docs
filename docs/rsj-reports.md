# RSJ Reports

### OpCon Reports Directory

The opcon_reports directory is only available from SMA Technologies'. Symitar does not support the opcon_reports directory. 

After a job is run through RSJ, RSJ creates a directory in the following location:

```/SYM/SYMnnn/opcon_reports/jobfile ```

In place of "jobfile" is the name of the jobfile that was executed. Each batch output file and report file created by the job is stored in this directory. To help maintain those directories the following features have been added:

An OpCon job can be created to tar/zip this directory up and move the tar file to another directory for archival purposes. This will enable customers to go back to any day and see what succeeded/failed on that day.

A second OpCon job can be created to clean this directory every morning.

Links to the sequence number reports in the REPORT directory are made to the nested jobfile directory under the opcon_reports directory. Using links is a more efficient usage of disk space than creating a copy of each report.

### RSJ Report Naming

When Symitar jobs run, the reports created are placed in ```/SYM/SYM###/REPORT``` (the ### is the three digit SYM number). Each report file is named as a six digit number. 

There is one report file that is the "cross reference" between these sequence numbers and the report titles (as well as other information). This cross reference report is called the batch output file. 

:::info Note

The following batch output file shows the type of information available. 

The cross reference entries between report sequence numbers and report titles have been highlighted. 

This is not the entire file. The entire file is approximately two thousand lines long with normal jobs. 

This file can be in excess of ten thousand lines.
 
:::

### Batch Output file 

:::tip Example

%JOBFILE NOONREPOSTRETURNS.001

%DIRECTORY SYM001 %QUEUE 0 %PRIORITY 4 %USER 0000

%PROGRAM EXCPITEMREPORT

======================= SYMITAR SYSTEMS BATCH PROCESSING ======================

Processing begun on 10/12/05 at 10/12/05 12:03:04 Batch Sequence: 63

 

Exception Item Reports

 

(0) Assign a Batch ID

(1) Generate a Report

(2) Delete Batches

(3) Move Items to Edit File for Posting

(4) Reset Review Status

 

Selection: 3

 

(0) Draft Exceptions

(1) ACH Exceptions

(2) ATM Exceptions

(3) Card Exceptions

(4) Fee Exceptions

(5) Insurance Exceptions

(6) Misc Post Exception

(7) Payroll Exceptions

(8) Distribution Exceptions

(9) Memo Post Exceptions

 

Exception Type: 1

 

Report Order

 

(0) Account Number

(1) Processor Account Number

(2) Batch ID

(3) Trace Number

(4) Branch Number

(5) Exception Reason

 

Sort First by: 0

Sort Next by : 3

Sort Next by : 1

Sort Next by : 2

Sort Next by : 4

Batch ID List: 999999

 

(0) All Resubmitable Item Types

(1) No Return - Resubmits Only

(2) No Return - Force Pays Only

(3) No Return - Force Pays No Fees Only

(4) No Return - Resubmit No Fees Only

 

Type to Move: 1

 

Maximum Days Old (0 for All): 0000

 

New ACH Entry Totals:

Count: 4

Date: 10/12/05

Debit amount: 1,695.40

Credit amount: 230.88

 

ACH Grand Totals:

Count: 572

Date: 10/12/05

Debit amount: 98,153.31

Credit amount: 104,442.47

 

Seq: 002409 Pages: 1 Title: ACH Excp Items Moved Into Edit File

 

Processing done on 10/12/05 at 10/12/05 12:03:04 Elapsed Time: 0:00:00

 

======================= COMPLETION OF BATCH PROCESSING ======================

%PROGRAM ACHREPORT

======================= SYMITAR SYSTEMS BATCH PROCESSING ======================

 

Processing begun on 10/12/05 at 10/12/05 12:03:04 Batch Sequence: 64

 

ACH Reports

 

(0) Item Report

(1) Transfer Deposits to Edit File

(2) Item Removal

(3) ACH Origination

(4) ACH to Payroll Conversion

(5) OAI Report

 

Selection: 0

 

Report Order

 

(0) Account Number

(1) Settlement Date

(2) Transmission Date

(3) Company Name

(4) Company ID

(5) Custom Info Data

 

Sort First by: 3

Sort Next by : 0

Sort Next by : 1

 

Print Detail Listing?: Y

 

ACH Item Selection Specifications

 

(0) All Dates

(1) Specified Settlement Dates Only

(2) All But Specified Settlement Dates

(3) Specified Transmission Dates Only

(4) All But Specified Transmission Dates

(5) Settlement Dates On or Before Effective Date

(6) Specified Batch Jobs

 

Date Selection: 0

 

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

ACH Date (newline to skip): --/--/--

 

(0) All Companies

(1) Specified Company IDs Only

(2) All But Specified Company IDs

(3) Specified Company Names Only

(4) All But Specified Company Names

 

Company Selection: 0

 

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

Company (newline to skip):

 

(0) All Custom Info Data

(1) Specified Custom Info Data Only

(2) All But Specified Custom Info Data

 

Custom Info Data Selection: 0

 

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

Custom Info (newline to skip):

 

Transaction Code List: ALL

 

Seq: 002410 Pages: 39 Title: ACH Unposted Item Report

 

Processing done on 10/12/05 at 10/12/05 12:03:05 Elapsed Time: 0:00:01

======================= COMPLETION OF BATCH PROCESSING ======================

:::
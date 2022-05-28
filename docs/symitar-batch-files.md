# Symitar Batch Files

## Symitar Control Files/Response File

Below is a Symitar Control File/Response File example. When the user enters the parameters for a Symitar batch file, the Symitar interface builds a response file. The file simply contains the "prompt" and the value entered by the user. A colon (:) is used to separate the prompt from the value.

## Control File

:::tip Example

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

:::

## Symitar Batch File Program Commands

### @ [default_value]

Interactively prompts for a response both in interactive and batch jobs. No RSJ job may contain a "@" symbol. [default_value] may be present, but not always.

### ! [default_value]

* When program is being interactively executed, prompts user for response.
* When program is being run in a batch job, does not prompt user for response.

### @PREVSYSTEMDATE

* Prompts/does not prompt for previous processing date. 
* Users can add an optional numeric offset to the date:

@PREVSYSTEMDATE-10

### @SYSTEMDATE

* Prompts/does not prompt for today's processing date. 
* Users can add an optional numeric offset to the date:

@SYSTEMDATE+10

### @DATE(month,day,year)

* Uses current date. 
* Users can add an optional numeric offset to the date:

@DATE(month,day,year)+10

* Month – numeric, ranges from 1 to 12. This field can also contain THIS. THIS means use today's UNIX system date.
* Day – numeric, ranges from 1 to 31. This field can also contain THIS. THIS means use today's UNIX system date.
* Year – numeric, ranges from 00 to 99. This field can also contain THIS. THIS means use today's UNIX system date.

:::info Note

Typically, Symitar correctly processes the @PREVSYSTEMDATE, @SYSTEMDATE and @DATE commands in a job file. It is not necessary to change them to a "!".

:::

## Symitar Batch File Processing Directives

### %PROGRAM program_name

* Execute program_name

### %SPLIT program_name

* Execute program_name
* This command is currently ignored by RSJ

### %JOIN

* Wait for all previous %SPLIT programs to finish processing 
* This command is currently ignored by RSJ

### %JOBFILE job_file_to_include

* Include and execute this Symitar Batch file

### %RUNDATE option

* The %RUNDATE option forces/excludes processing on given days

:::info Note

The %RUNDATE only provides very crude scheduling options that do not always give the expected results. Each %RUNDATE command is logically Or's with the previous %RUNDATE commands for a single boolean output.

:::

### %RUNDATE MMDDYYY

* Only run this script on this date

### %RUNDATE MMDDYY

* Only run this script on this date

### %RUNDATE MATCHSINCEPREVIOUS

* Iteratively match each date between the previous system date and the current system date for all %RUNDATE commands

### %RUNDATE NOMATCHDAY(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)

* Runs on any day that does NOT match the specified day

### %RUNDATE MATCHDAY(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)

* Run on any day that does match the specified day

### %RUNDATE MATCHDATE(mm,dd,yyyy)

* Runs on this date only

### %RUNDATE MATCHDATE(--,FINAL,--)

* Runs on the final day of month. "—" indicates all days/months/years. "FINAL" indicates end of month

### %RUNDATE MATCHDATE(--,FINAL-1,--)

* Runs on the final day of month minus 1 day
* "—" indicates all days/months/years
* Note that math is only permitted in the day field
* The field can contain a day|THIS|FINAL, a +|-, and a numerical offset
* FINAL is only permitted in the day field

### %RUNDATE MATCHDATE(--,THIS,--)

* Runs today on every month and every year

### %DIRECTORY nnn %QUEUE m %PRIORITY n %USR 0000

* Not used by SMA Technologies

### ;

* This is a comment
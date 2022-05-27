# Important Symitar Concepts

## RSJ Dates Processing

RSJ programmatically processes dates from Symitar via the SMA_DATES.JOB REPGEN. SMA Technologies does not directly read the dates from the Episys system. Instead, it uses the file SMA_DATES to store the current and previous processing dates. It is imperative to keep this file up to date with the actual processing date; otherwise, RSJ will incorrectly interpret the job files.

### SMA_DATES
The file is generated from the Episys job SMA_DATES.JOB.
* SMA_DATES retrieves the previous processing date, current processing date and the current system date from the Symitar database.
* This file is used to tell RSJ what processing dates are used in all of the RUNDATE date calculations.

:::warning

This file must be updated immediately after any date change or use of the install_dates program. Failure to Properly install/run SMA_DATES will cause RSJ to run incorrectly.

:::

To make sure that SMA_DATES is updated immediately after moving to the next system date, place the following line immediately after the CLOSEDAY program. The CLOSEDAY program is typically found in the GOODNIGHT job.

:::tip Example 

%JOBFILE SMA_DATES.JOB

:::

:::info Note

The default SMA_DATES file is installed (by the installation program install_dates) and must be updated by SMA_DATES.JOB before any correct processing can occur.

:::

The files involved are listed below. The nnn is the three-digit SYM number.

* /SYM/SYMnnn/LETTERSPECS/SMA_DATES
* /SYM/SYMnnn/BATCH/SMA_DATES.JOB
* /SYM/SYMnnn/REPWRITERSPECS/SMA_DATES.RG

If install_dates is running on a SYM, immediately run SMA_DATES.JOB to reset the processing dates. If manually resetting Episys processing dates, run the SMA_DATES.JOB after the date reset (either from install_dates or a manual date reset).

## How SMA sets Prompts

SMA Technologies uses the program update_scf to modify each Symitar job file prompt. Once all of the interactive prompts have been modified, RSJ can then run the job file. All of the interactive prompts in a nested job can be found by running the RSJ utility program find_prompts. The find_prompts program gives all of the information necessary to set up the update_scf program.

## Directory Structures and Files

```
/SYM 
    /SYM000 
            /BATCH 
                    SMA_DATES.JOB 
                    Some_job_name_1 
                    ... 
                    Some_job_name_n 
            /REPORT 
                    00013 000177 000179 000180 000181            
            /opcon_reports
                    Some_job_name_1
                        000566
                        000567
                        BATCH_OUTPUT.xxxxxx
                        ...
                    Some_job_name_n

                        000881
                        000882
                        BATCH_OUTPUT.xxxxxx
            /LETERSPECS
                    SMA_DATES
    /SYM###
            /BATCH
                    SMA_DATES.JOB
                    Some_job_name_1
                    ...
                    Some_job_name_n
            /REPORT

                    000566 000567 000881 000882 000884 000885
            /opcon_reports
                    Some_job_name_1
                        000566
                        000567
                        BATCH_OUTPUT.xxxxxx
                        ...
                    Some_job_name_n
                        000881
                        000882
                        BATCH_OUTPUT.xxxxxx               
            /LETTERSPECS
                    SMA_DATES
```
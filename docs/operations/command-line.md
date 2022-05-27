# Command Line to Run a Job

```/ops/bin/RSJ [-Eeditfile_name] [-d] [-D] SYM# JobName [restart_point]```


## RSJ Command Line Parameters

| Command Line Parameter | Description |
| ---------------------- | ----------- |
| -Eeditfile_name | The –E parameter is optional. It specifies the path and name of the file to move into the ```/SYM/SYMnnn/EDITFILE.DATA``` There is no space between the –E and the editfile_name. If an EDITFILE is specified, RSJ will automatically run the job in single_thread mode. For information, refer to [Single Thread versus Multi-Thread](#single-thread-versus-multi-thread).|
| -D | The –D parameter is optional. It causes RSJ to delete the contents of ```/SYM/SYMnnn/opcon_reports/job_name_to_run``` before running the job. If the –D switch is not present on the command line; the directory will not be deleted before running the job. |
| -d | The –d parameter is optional. It causes RSJ to delete the –E. ```Eeditfile_name``` upon successful completion of the job. If the –d switch is not present on the command line, the editfile_name file will not be deleted. |
| SYM# | The SYM# parameter is required. It tells RSJ which SYM to run the job in. The SYM number can be in either of the following formats: 000 or SYM000. |
| -sSummaryFileConfig | The –s parameter is optional. It specifies the path to a configuration file that controls the creation of a "summary file". (Usually, this summary file is only created for jobs with very large batch output files – like Goodnight.) Refer to [Summary Files](summary-files) for more details. *Note: Until the Enterprise Manager is updated, you will have to change the OpCon job type to ```<None>``` in order to add this parameter.* |
| JobName | The JobName parameter is required. It tells RSJ the name of the Symitar Batch Job to run. 
restart_point | The restart_point parameter is optional. It tells RSJ the name of a restart point to look for in a Symitar Batch Jobfile. For more information, refer to [RESTART_POINT](symitar-job-file-commands#restartpoint). |

## Single Thread versus Multi-Thread

RSJ defaults to the single_thread mode - that is only a single job can run in a SYM at one time. A number of users can submit any number of RSJ jobs, but RSJ will wait for each job to complete. It cannot be determined which RSJ job will run next. RSJ allows the use of more than one job at a time by using the multi_thread mode. In this mode, no jobs with an EDITFILE will be allowed to run. Any number of other jobs will be allowed to run. There is no error checking/handling for multiple jobs in this mode. It is explicitly assumed that the user knows what he is doing and has a good reason for doing it.

### The -Esingle_thread Option
The special filename of single_thread causes RSJ to run only a single job at time.
While the job is running no file will be moved to EDITFILE.DATA.
All RSJ jobs are single_thread by default.
The single_thread mode will only allow one RSJ job to parse and run an Episys job file at a time.

### The -Emulti_thread Option
The special filename of multi_thread allows RSJ to run multiple jobs at a time.
While the job is running no file will be moved to ```EDITFILE.DATA```.
White "X" icon on red circular background	WARNING: The multi_thread option assumes that the user knows which Episys jobs can be run at the same time. This option disables RSJ checks relating to running multiple jobs at a time.

## Execution Path
RSJ will first look in the current sym (i.e., SYM000). If the program name is not found, it then looks in the /SYM/SYMPR directory for the program. Lastly, RSJ looks in the current directory.

## Execution Environment
RSJ always prepends the following path before executing any jobs:
```/SYM/MACROS:/SYM/SYMPR:/usr/bin:/etc:/usr/sbin:/usr/ucb:/usr/bin/X11:/sbin```

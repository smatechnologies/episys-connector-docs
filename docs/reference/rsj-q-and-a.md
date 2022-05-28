# RSJ Q & A

### Can you automate the handling of ACH files?

It depends. The USB security device that is required to access FedLine Advantage cannot be left plugged into a computer. This means that this step will always have a manual component. Once the ACH files have been downloaded to this machine, the files can be detected by SMA Technologies' file watcher services and processed automatically. If a third party processor is being used, then SMA Technologies can automate the process. If the credit union has access to Fedline Command, then the process can be automated.

### Can you monitor websites that are hosted by Symitar software?

SMA Technologies is just getting into this arena, so knowledge is limited. Websites that are part of the Symitar system have MCWSTART as part of the URL. Perl scripts have been created that will do a dummy login (that is known to fail) and then test to verify that the appropriate error message is returned. This means that the web-site is responding and processing transactions. Additional coding could be done, but has not been requested to date.

### How does OpCon detect the failure of a Symitar batch job?

Refer to [Symitar Exit Codes](symitar-exit-codes.md) or [MAX_EXCEPTIONS](operations/symitar-job-file-commands.md#max_exceptions).

### Will my processing be completely automated when SMA Technologies leaves my site?

Absolutely not. It is more important that SMA Technologies teach your personnel how to solve scheduling problems and become self-sufficient. 

Instead of dropping a "standard" database into the site, SMA Technologies' trainers will work with the staff to develop the workflows. 

This means that the staff will understand how these workflows operate and can leverage this knowledge to solve other problems. Also, this permits the staff to enhance these workflows as the environment changes.

### How do I tell SMA Technologies' output lines from Symitar lines?

SMA Technologies' lines will ALWAYS begin with "DEBUG" "INFO" "WARN" or "FATAL" followed by the date and a message:

```FATAL Thu Sep 6 11:55:01 2007 FATAL - TOO MANY EXCEPTIONS in EXCEPTION REPORT```

```FATAL Thu Sep 6 11:55:01 2007 SMA Exits status is -140=```

### How do I figure out why my Symitar script failed?

Look at the bottom of the job output to view the reason why RSJ stopped processing the jobfile. Look for one of the SMA Technologies' output lines. The easiest way to do this is through JORS (right-click on the job and select "View Job Output" in the OpCon Schedule Operations screen).

### How do I figure out what file and program aborted? 

RSJ always outputs (prints) the file that it has opened and always outputs a message when it finishes processing a file. For nested jobs, it is possible to trace through SMA Technologies' messages and see what files have been opened and closed at any point in the job.

RSJ always outputs (prints) the name of the executable that it is executing and in what job file the executable is located. This makes it easy to see which program aborted.

### Why does my jobfile run in ssj/Autobatch but not RSJ?

AutoBatch and ssj do absolutely no error checking. If an error exists, these products will continue processing the jobfile. RSJ will stop the moment it detects an error. Odds are that there is an issue in the jobfile, or there are too many exceptions. Look at the bottom of the output file to view the reason that RSJ stopped.

### Why does my jobfile run interactively but not RSJ?

Episys does absolutely no error checking on a running job. If an error exists, these products will continue processing the jobfile. RSJ will stop the moment it detects an error. Odds are that there is an issue in the jobfile, or there are too many exceptions. Look at the bottom of the output file to view the reason that RSJ stopped.

### Can I use RSJ and Autobatch together?

This is highly discouraged. Operational issues will surface. RSJ is designed to eliminate these operational issues.

### Can I use RSJ and ssj together?

This is highly discouraged. Operational issues will surface. RSJ is designed to eliminate these operational issues. ssj depends upon AutoBatch, therefore it is unsafe to run with RSJ.

### How do I not stop on exceptions?

Set ```MAX_EXCEPTIONS=2,000,000,000``` at the beginning of the script.

### How do I not stop on errors?

Set ```ERROR_LEVEL=999``` at the beginning of the script.

### How do I make programs execute one at a time?

Use the ```-Esingle_thread``` flag of RSJ.

### How do I make multiple programs execute at a time?

Use the ```-Emulti_thread``` flag of RSJ.

### Can I move files to EDITFILE.DATA outside of RSJ?

No, RSJ will overwrite the file (use RSJ).

### RSJ is stopping on Error code 7 (Terminate specification found in a Repgen) - how do I stop this?

Set ```ERROR_LEVEL=1-6,8-10``` at the beginning of the job and then reset it on the next job.

### Why is RSJ ignoring MAX_EXCEPTIONS or ERROR_LEVEL or SCRIPT Commands?

* Odds are that a ";" was included at the beginning of the comment command which will produce a ";;" at the start of the line. Symitar interfaces will add an additional ";" before the actual comment. The actual command in the file is ;Command which will not be picked up by RSJ. When using the Episys text editor, a semi-colon is not required.
* The exact syntax was not used for the command. Recheck the syntax.
* Users are using Episys to modify the job files. Try putting the RSJ commands into a job file by themselves.
    * ```%JOBFILE TURN_OFF_CHECKING```

    * ```%PROGRAM CLOSEDAY```

    * ```%JOBFILE TURN_ON_CHECKING```

    * ```File: TURN_OFF_CHECKING```

    * ```;MAX_EXCEPTIONS 20000000```

    * ```File: TURN_ON_CHECKING```

    * ```;MAX_EXCEPTIONS 0```

### Why is RSJ not executing MAX_EXCEPTIONS, ERROR_LEVEL, SCRIPT, or RESTART_POINTS correctly?

* Using Episys to modify the job file is not recommended. All Episys job file editors will move any comment lines around in the file producing a job file that is totally incorrect. Do not use Episys editors – use a UNIX editor instead.
* The exact syntax was not used for the command. Recheck the syntax.
* Users are using Episys to modify the job files. Try putting the RSJ commands into a job file by themselves.
    * ```%JOBFILE TURN_OFF_CHECKING```

    * ```%PROGRAM CLOSEDAY```

    * ```%JOBFILE TURN_ON_CHECKING```

    * ```File: TURN_OFF_CHECKING```

    * ```;MAX_EXCPETIONS 20000000```

    * ```File: TURN_ON_CHECKING```

    * ```;MAX_EXCPETIONS 0```

### I need to use BSCMOVE with RSJ.

Using BSCMOVE is no longer needed. RSJ will perform copy/move of the data file to EDITFILE.DATA. Use this command instead of the normal processing sequence:

```/ops/bin/RSJ –E/full_path_to_data_file program_to_execute_against_EDIT_FILE```

### RSJ did not correctly delete my EDITFILE using the -d switch.

Look at the logfile, just a few lines from the bottom. Odds are that a message is found that indicates RSJ was unable to delete the input file. This is caused by a lack of permissions. Run a change permissions job before running RSJ.

### RSJ processes are taking up too many system resources.

Either use the nice AIX system command to execute RSJ or use the nice value in the OpCon Job Master screen.

### How do I see what RSJ jobs are running on the AIX box?

The options are:

* In a telnet window issue the following command: ```ps –dfeal|grep RSJ```
* In a telnet window issue the following command: ```proctree```
* The Enterprise Manager can also be used. The GUI is free to install on any number of client systems.

### How do I stop Error Checking?

Insert the following commands at the start of the job file:

```;ERROR_LEVEL 999```

```;MAX_EXCEPTIONS 20000000```

### What batch queues does RSJ use?

RSJ does not use batch queues.

### How do I effectively use the error checking in RSJ?

* Every program has its own error code returns. Each credit union will know what acceptable and unacceptable error code returns are. Set the ERROR_LEVEL to reflect acceptable error codes. RSJ will then automatically check the error codes. When new versions of Episys evolve, these codes may slightly change.
* Every program has its own exception report(s). There are actually two limits. One is the average number of exception pages and the second is that there is a problem at this number of exception pages. Let's take ACH posting as an example. On a normal day, more than 10-20 pages of exceptions would not be excepted. If 30-40 pages of exceptions is reality, odds are that something has been double posted or an old ACH file is being re-processed. It is possible to set the MAX_EXCEPTIONS to something very large, but then a valuable error diagnostic would be lost. The number of allowable exceptions is different for each credit union, and as the credit union changes size, the number of exceptions will change.
* Initial testing will not reveal all possible cases, so these limits will need to be adjusted as new cases reveal themselves.
* It is recommended to always use the ERROR_LEVEL and MAX_EXCEPTIONS commands together. The reason why is that RSJ will always check exceptions and the program return code.

### Regarding SMA Technologies Customer Support calls - what are the steps to take before calling SMA Technologies?

* Does the job run via Symitar (both interactively and via Symitar's Batch facilities)? If not, please modify your job deck/response files so that they do run.
* Are there ANY interactive prompts that use the "@"? If there are, they must be removed or replaced by a value. Use update_scf to set the interactive prompt.
* Is the problem related to Symitar programs and/or your internal processing sequence? If so, SMA Technologies cannot help you.
* Does the program run okay, then fail, then fail, then run when executed concurrently with other Symitar jobs? If so, this probably means that Symitar cannot safely run the set of programs together safely. The solution is to make sure that these jobs NEVER run together using OpCon scheduling or the –E switch to RSJ.
* Does the job exit with an error code or too many exceptions? If so, you need to think about how you want to handle errors from Symitar programs and set the appropriate RSJ options in your job file.
* Please send the nested set of jobfiles via a tar file. Also, please send the batch job output. To create a tar file (the filename will be my_tar_file.tar), enter something similar to (Please do not use spaces – UNIX does not like file names with spaces in them.):

```cd /SYM/SYM000/BATCH```

```tar –cvf my_tar_file.tar *```
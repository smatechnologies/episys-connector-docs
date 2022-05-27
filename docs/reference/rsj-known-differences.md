# RSJ Known Issues and Differences from Episys

* RSJ does not use the ```/SYM/SYMnnn/LETTERSPECS/EDITFILE.LOCK```. This permits users to run multiple programs at a time. It also means that some Symitar jobs can interfere with each other. It is the users' responsibility to use OpCon scheduling or the RSJ –E flag to prevent this from happening. This is an experimental feature that may be modified in future releases.
* RSJ uses the file ```/SYM/SYMnnn/sma_lock``` to store its locking information. This solution is a much more rigorous technical solution to the issues surrounding the use of EDITFILE.DATA. If a user specifies the use of the –E flag, only one RSJ job at a time will run (this is only for RSJ jobs that use the –E flag).

:::info Note
 
This is completely different than the Symitar locking scheme and it also means that AutoBatch/ ssj and RSJ cannot peacefully coexist.

:::

* RSJ does not use batch queues. Symitar defines batch queues to limit the number of jobs that can be run at one time. RSJ has removed this restriction. This may cause some unforeseen issues with Symitar programs. If a problem arises, please use the flag "-Esingle_thread" on the jobs with the problems. This is currently the default.
* RSJ does not detect all possible Symitar errors. If an error is found that is not being trapped (and should be), please send the batch output file to [support@smatechnologies.com](mailto:support@smatechnologies.com) with a quick note explaining what the error is and why it is occurring. Please mention that this is a Symitar error that should be forwarded to development.
* RSJ will stop on any detected error to prevent database corruption. This is different from Episys since Episys will continue running on all errors.
* RSJ will ignore any SPLIT and JOIN directives. Testing at client sites indicates that there is no appreciable elapsed time difference between running multiple stacked repgen jobs in a parallel mode and running them in a single thread mode. Symitar has also seen this in modern hardware. Symitar programs are typically disk bound. Executing multiple disk bound processes simply causes the disks to thrash. Executing the disk bound processes one after another causes the disk to be more lightly loaded and the disk head stays in a smaller area which makes for a faster read/write sequence. Additionally, because the disk head is staying in a smaller area, the disks' speculative read ahead cache has a higher hit rate, resulting in a much faster read sequence. An additional bonus of not running multiple parallel jobs is that the Symitar AIX system is much more responsive (read faster) to interactive requests and other batch jobs. If testing shows that there is an issue, run multiple RSJ jobs.
* RSJ may not fully output all errors to the ```/SYM/SYMnnn/REPORTS``` directory. Please use the view output option from OpCon to view the full job output.
* RSJ uses the file ```/SYM/SYMnnn/LETTERSPECS/SMA_DATES``` to get the previous processing date, current processing date and current system date. This file must be updated on a daily basis so that RSJ can properly process Symitar job files. It must also be updated any time the processing date changes.

# SAJ

## What is SAJ?

SAJ is a wrapper around RSJ that understands the "%SPLIT" and "%JOIN" commands. It is a distinct and separately licensed product from RSJ. SAJ will create a new set of job split files and then correctly run them in parallel via RSJ. 

SAJ only will process the %SPLIT and %JOIN commands if they are in the main (initial) job file. SAJ uses the error handling capabilities of RSJ to determine what errors should be ignored/processed. SAJ outputs the same logging style as RSJ and understands RSJ embedded directives.

## Why use SAJ or its alternatives?

If a credit union is running a lot of repgens that are taking too much time (wall clock time) and the credit union has a multiple CPU machine, then in some cases, not all, some speedup can be obtained by running in parallel. Typically, more speedup can be obtained by getting new hardware and for most credit unions the speedup using SAJ will be marginal. 

The same speedup (or possibly more) can be better obtained via the use of repgen "stacking" which is discussed in another section of this document. SMA Technologies recommends using SAJ as a last resort.

## Common Problems when Running in Parallel

No one can definitively state which programs can safely run together (unless they have access to ALL the source code involved and perform an in-depth code review).

The parallel mode is assumed to always give a better result, which is often not true. This comes from multiple tests at client sites by SMA Technologies.

Splits and joins are sometimes employed to overcome poor repgen coding or poor batch job design. Instead of analyzing why processing is taking an excessive amount of time, the "quick and dirty" solution is to throw in a split. Often, the judicious use of repgen stacking will improve performance much more significantly than by using splits and joins.

Running concurrent jobs through RSJ instead of SAJ provides MUCH more user control over the timing and mix of the workload.

## Command Line Options

```SAJ SYMnnn JOBFILE [RESTART_POINT]```

## Differences between RSJ and SAJ

* -E switch is not supported in SAJ.
* -d switch is not supported in SAJ.
* -D switch is not supported in SAJ.

    * Generally speaking, command line switches that are known in RSJ are ignored by SAJ.
    * If specified, the RESTART_POINT must be in the initial (main) job file. SAJ will not recognize a restart point in any other file.
    * SAJ will recognize %SPLIT and %JOIN directives in the initial (main) job file only. SAJ ignores all directives in any other files.
    * RSJ log files display any errors encountered at the bottom of the log. Because errors can occur in any split process, errors in SAJ are no longer at the bottom of the file – they can be anywhere in the file.
    * SAJ has its own set of errors that are different from RSJ.
    * SAJ will recognize all RSJ errors and consider the job failed if the RSJ exits with a non-zero value (regardless of ERROR_LEVEL settings).
    * SAJ will not process RSJ directives in the exact same manner as RSJ.
    * SAJ has two new directives SKIP_SECTION and END_SKIP_SECTION. These directives are to help users in error recovery. These directives tell SAJ when to start ignoring commands and when to start processing commands again. RSJ does not know how to process these directives.
    * SAJ will execute any ";SCRIPT" directive in all downstream splits. RSJ will only execute the ";SCRIPT" directive once. It is highly recommended to avoid the use of the ";SCRIPT" command in the main batch job.
    * SAJ "stacks" all RSJ commands and prepends them onto each subsequent split job. This causes a divergence with RSJ processing algorithms.

## SAJ Restrictions

For best results when using directives, place them either in the SMA_DEFAULTS file or include them via the %JOBFILE command. Avoid the use of ";SCRIPT" directives in the main job file (the script will be executed in all split job files).

Restart points must be in the main job file.

If any system resources (memory, cpu, disk, io bandwidth, or response time) are limited, it is highly recommended that you do not run SAJ (because running in parallel mode can consume more resources than an equivalent single-threaded execution and can highly tax your system).

## SAJ Restart Points

An SAJ restart point MUST be in the main (initial) job file. If any issues are found, users must either re-run the job through RSJ with a restart point, manually split up the job or use the new SAJ directives ";SKIP_SECTION" and ";END_SKIP_SECTION".

## SAJ/RSJ Directives

SAJ stores all RSJ directives and will automatically place all processed directives (from the main file) at the top of any SPLIT job. Note that if an included JOBFILE has RSJ directives or SPLIT/JOIN directives, SAJ will not process these directives. RSJ will see these directives, however. It is SMA Technologies' recommendation, that all desired directives be placed in their own job file(s) and these job files should be placed around each SPLIT section.

:::tip Example

%JOBFILE TURN_OFF_ERROR_CHECKING.JOB

%JOBFILE SOME_JOB_TO_RUN.JOB

%JOBFILE TURN_ON_ERROR_CHECKING.JOB

%SPLIT

%JOBFILE TURN_OFF_ERROR_CHECKING.JOB

%JOBFILE SOME_JOB_TO_RUN2.JOB

%JOBFILE TURN_ON_ERROR_CHECKING.JOB

%SPLIT

%JOIN

:::

SAJ has two new directives to help restart failed processes – ";SKIP_SECTION" and ";END_SKIP_SECTION". These commands tell SAJ to stop processing commands and when to start processing commands again. Assume that a job that has five SPLIT sections and jobs 1, 3 and 5 fail. Using a text editor, you could "comment out" the jobs that correctly ran (jobs 2 and 4). This would allow you to restart the job safely without re-running the processed jobs. A before and after example follows.

:::tip Example

Before:

%JOBFILE job1

%SPLIT

%JOBFILE job2

%SPLIT

%JOBFILE job3

%SPLIT

%JOBFILE job4

%SPLIT

%JOBFILE job5

%SPLIT

%JOIN

:::

:::tip Example

After "commenting out previously processed sections:"

%JOBFILE job1

%SPLIT

;SKIP_SECTION

%JOBFILE job2

%SPLIT

;END_SKIP_SECTION

%JOBFILE job3

%SPLIT

;SKIP_SECTION

%JOBFILE job4

%SPLIT

;END_SKIP_SECTION

%JOBFILE job5

%SPLIT

%JOIN

:::

## SAJ Log Output

There are three different programs that insert lines into the SAJ output (RSJ, Symitar programs, and SAJ). SAJ lines have the form of [FATAL|INFO|WARN|DEBUG] day month day time year WRAPPER message.

RSJ lines have the form of [FATAL|INFO|WARN|DEBUG] day month day time year message. If the line does not match one of the above formats, then it is a Symitar message.

Single-threaded sections are delineated by messages of "starting single thread section" and "ending single thread section". These messages are surrounded by lines of "**************************************". This allows users to determine exactly what ran in parallel and what run sequentially. If a section is running as a single threaded section when it should be running in parallel, make sure that a "%JOIN" statement is present.

Multi-thread/split sections are delineated by messages of "starting split section" and "ending split section". These messages are surrounded by lines of "**************************************". This allows users to determine exactly what ran in parallel and what ran sequentially.

## SAJ Troubleshooting

SMA Technologies cannot tell any credit union which programs can be safely run concurrently. Credit Unions might be running home grown programs, third party programs or Symitar programs. If SMA Technologies did not write the code, SMA Technologies cannot validate that the programs can run together. It is highly probable that the Symitar database will become corrupted if incompatible programs are run together. If this happens, call Symitar immediately since they are the only ones who can help on this issue.

It is recommended to run the job through RSJ first. This will simplify any basic troubleshooting issues. Once it can run in a single threaded mode, then it is time to try and run it in multi-thread mode. If it fails again, look carefully at the RSJ error handling directives. If SAJ runs sometimes but not others, it is highly recommended to use RSJ (this will get rid of any system level/database level conflicts).

The first step is to look at the SAJ log. The log file will normally be very long, but it will indicate what type of error was encountered. Remember that you have to look at every line in the output file to find where the error occurred.

Note that SAJ will not always run the same job deck in the exact same way. Assume that programs 1-5 are to be run in parallel. On day 1 they might run in the order 1,2,3,4,5. The next day, it might be 5,4,3,2,1 and the next day it might be 3,4,1,2,5. This can cause serious and difficult debugging issues.
 
SAJ always assumes that there will be a "%JOIN" statement in the main job deck after the "%SPLIT" sections. Failure to place a %JOIN statement in the main job deck will cause SAJ to process the very last section as a single threaded section and slow down processing.

As the first line of troubleshooting, always use the command "df –g" and examine it in detail. Look at the "%Used" column and validate that all fields are <90%. If they are not, consider calling Symitar. Look at the "%Iused" column and validate that all fields are <90%. If they are not, call Symitar for help.

SAJ has quite a bit of logic to help deal with files that do not get written to disk in a timely manner; however, this logic can fail from time to time. Failures will be most pronounced during periods of heavy system loading. If your site does not get near heavy system loading, SAJ may work without problems (at least with this potential issue). Typically, this type of error will not appear to make any sense at all and is generally not repeatable.

## SAJ Alternatives

SMA Technologies recommends the use of repgen stacking (even with SAJ) – it is simple, easy to implement, and works very well. Repgen stacking means that users perform a code review and decide which repgens target the same database; then the same repgen execution uses the same cached data for N reports. Symitar has done a wonderful job of allowing multiple repgens to access the same data cache. The one caveat is that end users must manually sort out which repgens access the same databases. This is actually an advantage since this allows users to minimize the total run time. SMA Technologies sees stacking as an excellent feature and it is highly recommended.

RSJ is capable of running jobs in parallel straight of the box. SAJ makes liberal use of this facility. Using OpCon and RSJ in multi-thread mode is highly recommended. The one caveat is that end users must manually sort out which repgens access the same databases. This is actually an advantage since this allows users to minimize the total run time.

## Why can running in parallel be slower than running a regular RSJ job?

Assume that 6 programs are going to be run in parallel and that the system is unloaded (if the system is loaded then performance will be even worse). Further assume that programs 1-5 access different databases, but that program 6 accesses the same database as program 1. Basic systems analysis reveals:

1. The disk is the slowest device in the computer (by several orders of magnitude). Stated another way, reading and writing disk blocks limits how fast the computer can run.
2. The less disk head movement that occurs, the faster the disk reads/writes occur.
    * Typically, files on the operating system are written in consecutive blocks which allow the disk read-ahead cache to become really efficient. If the disk is to reading multiple files, the read-ahead cache becomes pretty much useless.
    * The operating system also has a disk cache. If a single file is being read/written the cache can operate at maximum efficiency.
    * Symitar also maintains an internal disk cache. Again, if a single file is being read/written the cache can operate at maximum efficiency.
    * The disk controller and the physical disk(s) also have disk caches. If a single file is being read/written the cache can operate at maximum efficiency.
3. There is a maximum number of disk blocks that can be read/written per second. Requesting that the hardware exceed its maximum disk transfer speed significantly degrades processing throughput.
4. Running multiple programs in parallel can cause non-linear disk table allocations which cause disk head "thrashing". Running programs in parallel can also cause cache misses and cache thrashing.
5. Adding more memory (ask Symitar for help) can help minimize system/Symitar cache thrash problems. Stated another way, too little memory causes programs to run slower.
6. There is a maximum amount of processing that can be done on a given piece of hardware. Exceeding/overloading the system capacity dramatically slows the interactive response time and increases total processing time. Stated another way, once the straw that breaks the camel's back is found, the computer system becomes effectively paralyzed.

Since 5 different databases are being accessed concurrently, all of the disk caches are not only inefficient, but actually slow things down. Program six has probably started well after (time-wise) program one which will cause program six to need different data records than program one. This will cause more cache thrashing (which slows things down even more).

## Are there other tips for speeding things up?

1. Free up disk space until there is at least 10% free (preferably a lot more). This keeps the disk head from thrashing and makes file allocations more linear around the disk.
2. Look at the run times for each repgen. As a very rough rule of thumb, all of the repgens should complete in the same time frame. If one or two take a lot longer, it might be worthwhile to look for inefficient coding.
3. Try to eliminate extraneous processes during peak processing times.
4. Look to see if changing the order of the repgens would improve run times by using caches better.
5. Are there any reports (repgens) that can be deleted or run less frequently?
6. Defragment (defrag) your disk. There are three methods that can accomplish this. Symitar needs to be consulted for any of these procedures.
    * The first program is defragfs. It is an IBM supplied utility to defragment a disks free space. Note that this utility does not defrag existing files. Check with Symitar before performing this procedure. If a more user friendly "GUI" is desired, consider using the command "smitty jfs2". It is recommended to unmount the disk before this procedure is commenced.
    * The second solution is to periodically backup your disk, delete user data files and then restore the backup. Using most common backup programs, this will re-allocate files to contiguous regions of the disk and reduce disk head seek times. You will need to validate this assumption with your backup software provider. Symitar should be consulted before you attempt this procedure. A short example and commentary for defragging the /u drive is repeated in the next two bullet points.

:::tip Example

cd /u

find . -print|backup -ivqf/dev/rmt0

cd /

umount /u

mkfs dev/hd1

fsck -p /dev/hd1

mount /u

cd /u

restore -xvf/dev/rmt0

:::
    
* A third-party vendor claims to be able to defragment an AIX file system up to AIX5.3. SMA Technologies has not used this vendor. Refer to [http://www.compunix.com/prod/defrag.html](http://www.compunix.com/prod/defrag.html) for more information. Their benchmarks are very interesting. Again, Symitar will need to be consulted before running this software. As a side note, their main product is to recover deleted files.

## Why is SAJ directive processing different from RSJ?

The core difference is in the way that SAJ and RSJ process files. Because RSJ processes everything sequentially, it will always be able to linearly process all directives. Because SAJ processes everything in a series of parallel operations, directives that are in a parallel operation can never be propagated to the other parallel operations.

## SAJ vs. Symitar Parallel Processing

SAJ supports full error checking, restart points and logic to help restart failed parallel jobs while all products from Symitar do not. It is not guaranteed that SAJ and Symitar will process the same job deck the exact same way (there are ambiguities in the directives). SAJ supports all RSJ directives while Symitar does not support any SAJ/RSJ directives.

Symitar parallel processing continues to run in the presence of errors and makes no attempt at helping restart failed jobs.

## SMA SAJ Support Limits

* SMA Technologies cannot tell any credit union which programs can safely run together. If SMA Technologies did not write the code, SMA Technologies cannot assist in this issue.
* SMA Technologies cannot tell any credit union why programs cannot run together. If SMA Technologies did not write the code, SMA Technologies has no opinion on this issue.
* SMA Technologies cannot generally tell any credit union how to run programs in parallel. This is an issue that varies from credit union to credit union based upon hardware, credit union size, system loading and tasks that are being asked of the system.
* SMA Technologies will not accept any responsibility for crashed or damaged databases since SMA Technologies cannot tell what processes can be safely run together. Additionally, SMA Technologies has no way of knowing what was being run interactively at the time of or before the crash.
* SMA Technologies cannot diagnose any system load issues with SAJ (since, by definition the load is always changing).
* SMA Technologies cannot take any responsibility for failed processes since the likely causes are environmental issues (i.e., system loading or other parties programming issues) in the client environment.
* SMA Technologies' ability to diagnose issues with failed processes executed by SAJ/RSJ will be extremely limited (SMA Technologies cannot reproduce your exact environment).
* SMA Technologies' support will be generally limited to validating that SAJ correctly attempted to run the tasks it was asked to perform. SMA Technologies is open to looking at additional features that will make credit unions lives easier and safer.

## SAJ Files

```/SYM/SYMnnn/BATCH/SMA_SPLIT_mmmmm_SEQNUM.JOB``` where nnn represents the SYM number and mmmmm represents a random number chosen by SMA Technologies.

```/tmp/job_name.jobmmmm``` where mmmmm represents a random number chosen by SMA Technologies.

## SAJ Definitions

### Single-threaded

Running a single program at a time.

### Multi-threaded

Running two or more programs at the same time.

### Cache

A memory store used to buffer data read in or data to be written in order to improve disk I/O performance.

### Cache miss

If the requested disk blocks are not in the cache, they must be loaded/reloaded from the disk drive. If the miss rate is too high, then the cache can actually slow down processing.

### Cache thrashing

This happens in two common cases and is defined as data blocks being loaded, unloaded and the reloaded again. Case 1 is where the cache is too small (i.e., you are running too many programs against the cache). Case 2 is where the cache loads the data block for a short time, unloads it, and is then requested to load it again (these are expensive operations).

### Disk head thrashing

The disk head moves over the entire disk in a random fashion repeatedly. This condition causes an extreme slowdown in speed. The more a disk head can stay in a given region on the disk, the more disk blocks per second can be read/written.

### Contiguous file allocation

When files occupy contiguous blocks with no extents (file block fragments).

### Fragmented file allocation

When files occupy non-contiguous blocks.
# Known Symitar Issues

* Earlier Episys releases do NOT return error codes. Current releases do return error codes, but not for all errors and all programs. SMA Technologies fully supports the exit codes provided by Symitar.
* Symitar has not provided a list of programs that can safely run together. Symitar has stated that credit unions know which programs can run together. Users may interactively run both programs at the same time from two different terminals and verify that the programs do not interfere with each other. OpCon can also be used to perform this test. It may be necessary to run the programs multiple times. However, this test does not guarantee that the programs can safely execute with one another because of timing issues.
* All Symitar job file editors re-order comments in a job file. They move all comments to the top of the file regardless of where they are located in the file. This causes any RSJ commands in a job file to be moved to the top of the job file. It can cause RSJ to incorrectly process a job file. Setup a job using the Episys editors, but once RSJ commands are placed in the job file, use a UNIX editor for all further viewing/modifications.
* Symitar job editors will silently remove some job/job file commands.
* Some Symitar programs do not return error status.
* Some Symitar programs now return error codes outside of the normal 1-10 range.
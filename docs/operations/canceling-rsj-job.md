# Canceling an RSJ Job

The cancel_rsj program instructs RSJ to stop running the specified jobfile as soon as the current program finishes executing. This program will only stop the specified jobfile.

:::warning

Do not stop/kill/cancel an rsj job with any other method besides the cancel_rsj program. Doing so will cause corruption in the Symitar database.

::: 

The command format is: ```cancel_rsj sym# jobfile```.

* **sym#**: The number to search. The input choices are:
    * **nnn**
    * **SYMnnn**
* **jobfile**: Job file to search for canceling.

Symitar creates a ghost login whenever a program starts running. If the action takes place to Kill/Cancel the job in the middle, Symitar does not detect that the program no longer exists. The symptoms are that CLOSEDAY will hang, and on the operator console, the message(s) "Waiting for BATCH LOGON nn to close" will appear repeatedly. The CLOSEDAY process will not be getting any CPU time.

At that point Symitar must login to the machine and clear the ghost logins (if possible). DO NOT Kill or Cancel Symitar jobs. Wait for them to finish to prevent CLOSEDAY from failing and having to reload the SYM.

:::tip Note

It is also advisable to remove the privilege of "Allow Kill Job" from OpCon on all Episys machines. To remove the Allow Kill Job privilege, follow the procedure below.

::: 

## Remove the Allow Kill Job Privilege from OpCon

1. From the OpCon splash screen, click the Administration tab.
2. On the menu bar, select Tables > Machines.
3. From the Machines screen, select the name of the machine in the Name drop-down list.
4. Click the Stop button (Communication between the SMAServiceManager and the machine needs to be stopped to make this change).
5. Click the Advanced button.
6. Click the Allow "Kill Job" towards the bottom of the table.
7. Click the False radio button on the bottom left of the screen.
8. Click the Accept button.
9. Click the Save button.
10. From the Machines screen, click the Start button.

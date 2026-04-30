---
title: Canceling an RSJ job
description: "Cancel a running RSJ job safely using the cancel_rsj program to avoid Symitar database corruption."
tags:
  - Procedural
  - Operations Staff
  - Agents
---

# Canceling an RSJ job

## What is it?

The `cancel_rsj` program instructs RSJ to stop running the specified job file as soon as the current program finishes running. This is the only supported method for stopping an RSJ job. Using any other method (such as killing the process) can corrupt the Symitar database.

- Use `cancel_rsj` when you need to stop a running RSJ job before it completes.
- Do not use the OpCon **Kill Job** action for Episys machines — remove this privilege to prevent accidental database corruption.

:::warning

Do not stop, kill, or cancel an RSJ job with any method other than the `cancel_rsj` program. Doing so can cause corruption in the Symitar database.

:::

## Command syntax

```
cancel_rsj sym# jobfile
```

| Parameter | Description |
| --------- | ----------- |
| `sym#` | The SYM number to search. Accepted formats: `nnn` or `SYMnnn`. |
| `jobfile` | The name of the job file to cancel. |

## Ghost login behavior

Symitar creates a ghost login whenever a program starts running. If a job is killed or canceled mid-execution, Symitar does not detect that the program no longer exists. The symptoms are that CLOSEDAY hangs, and the operator console repeatedly shows "Waiting for BATCH LOGON nn to close." CLOSEDAY does not receive any CPU time.

At that point, Symitar must log in to the machine and clear the ghost logins, if possible. Do not kill or cancel Symitar jobs — wait for them to finish to prevent CLOSEDAY from failing and requiring a SYM reload.

## Remove the Allow Kill Job privilege from OpCon

It is advisable to remove the **Allow Kill Job** privilege from OpCon for all Episys machines to prevent accidental job termination.

To remove the Allow Kill Job privilege, complete the following steps:

1. From the OpCon splash screen, select the **Administration** tab.
2. On the menu bar, select **Tables > Machines**.
3. From the **Machines** screen, select the name of the machine in the **Name** list.
4. Select the **Stop** button (communication between SMAServiceManager and the machine must be stopped to make this change).
5. Select the **Advanced** button.
6. Select the **Allow "Kill Job"** option toward the bottom of the table.
7. Select the **False** radio button at the bottom left of the screen.
8. Select the **Accept** button.
9. Select the **Save** button.
10. From the **Machines** screen, select the **Start** button.

## FAQs

**What happens if I kill an RSJ job without using cancel_rsj?**
Symitar leaves a ghost login that prevents CLOSEDAY from completing. This typically requires Symitar support to clear the ghost logins and may require a full SYM reload in severe cases.

**Will cancel_rsj stop sub-jobs that are already running?**
`cancel_rsj` instructs RSJ to stop after the current program finishes. Any program already running in the batch queue must complete before RSJ stops processing the job file.

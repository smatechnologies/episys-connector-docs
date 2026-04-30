---
title: Running RSJ as SYM user and elevating to root
description: "Configure RSJ to run under the SYM user security context and temporarily elevate to root for specific batch jobs that require root permissions."
tags:
  - Procedural
  - System Administrator
  - Agents
---

# Running RSJ as SYM user and elevating to root

## What is it?

By default, RSJ was defined in the Enterprise Manager to run as root, but it immediately changed to the SYM user after starting. This page describes how to configure RSJ to run entirely under the SYM user context, and how to use the `ExecuteAsRoot` directive to temporarily elevate permissions for specific jobs that require root access (such as `SYSTEMBACKUP` in Episys SP3 and later).

- Use this configuration to improve security by removing the root job definition from OpCon.
- Use `ExecuteAsRoot` only for the specific Symitar programs that require root permissions.

## Running RSJ as a SYM user

### Configure the agent

To configure the agent to run under the SYM user, complete the following steps:

1. In `$LSAM_ROOT/config/<socket>/lsam.conf`, set `path_to_su` to `no`.
2. Stop and restart the agent.

### Configure the RSJ installation

This must be done while logged in as the root user. If the directories already exist, verify that the permissions are set correctly.

To configure the RSJ installation, complete the following steps:

1. Create the required directories by entering:
   - `mkdir /ops`
   - `mkdir /ops/bin`
   - `mkdir /ops/bin/args`
   - `mkdir /ops/bin/cancel`
   - `mkdir /tmp/SMA`
2. FTP or copy the RSJ tar file to `/ops/bin`.
3. Extract the tar file by entering:
   - `cd /ops/bin`
   - `tar xvf *.tar`
4. Set the correct directory permissions by entering:
   - `chmod -R 777 /ops`
   - `chmod 775 /ops/bin/*`
   - `chmod 777 /ops/bin/args`
   - `chmod 777 /ops/bin/cancel`
   - `chmod 777 /tmp/SMA`

## Temporarily raising permissions to root

### Background

With Service Pack 3 of the latest version of Episys, Symitar modified the `SYSTEMBACKUP` script to include a command (`cfgmgr`) that can only be run by root or a user in the system group. This means that specific jobs must be run as root. RSJ provides the `ExecuteAsRoot` directive to allow a Symitar batch job to run as root and then return to the SYM user.

For example, in a GOODNIGHT job where only `BACKUPSYM000TOSYM001` requires root:

```
%JOBFILE OFFLINE
%JOBFILE BACKUPSYM000TOSYM001
%JOBFILE CLOSEDAY
%JOBFILE SMA_DATES.JOB
%JOBFILE DELETE_REPORTS
%JOBFILE ONLINE
```

Add the `;ExecuteAsRoot` directive immediately before the job that requires root:

```
%JOBFILE OFFLINE
;ExecuteAsRoot
%JOBFILE BACKUPSYM000TOSYM001
%JOBFILE CLOSEDAY
%JOBFILE SMA_DATES.JOB
%JOBFILE DELETE_REPORTS
%JOBFILE ONLINE
```

### Create the root information file

To set up the root information file, complete the following steps:

1. Change directories to `/ops/bin` and examine the file `rootInfo`. The default values are:

   ```
   rootPromptCharacter=#
   pathToExpect=/usr/bin/expect
   pathTosu=/usr/bin/su
   pathToEnvironment=/SYM/OP/bin/LOGON
   ```

   Verify that these values are correct. Run `su - root` to verify the root prompt character. The default prompt string is `<hostname> #` — only the ending `#` needs to be specified. There may or may not be an environment file at `/SYM/OP/bin/LOGON`.

2. Once the values are correct, run `EncryptRootInfo`. You are prompted for the root password. `EncryptRootInfo` creates an encrypted file called `rootInfo.encrypted`.

3. Complete the setup by running:

   ```
   cp ExecuteAsRoot /SYM/<SYM#>/BATCH/ExecuteAsRoot
   chgrp <SYM#> /SYM/<SYM#>/BATCH/ExecuteAsRoot
   chown <SYM#> /SYM/<SYM#>/BATCH/ExecuteAsRoot
   chmod 700 /SYM/<SYM#>/BATCH/ExecuteAsRoot
   ```

   :::tip Example

   For SYM000:

   ```
   cp ExecuteAsRoot /SYM/SYM000/BATCH/ExecuteAsRoot
   chgrp SYM000 /SYM/SYM000/BATCH/ExecuteAsRoot
   chown SYM000 /SYM/SYM000/BATCH/ExecuteAsRoot
   chmod 700 /SYM/SYM000/BATCH/ExecuteAsRoot
   ```

   :::

   :::info Note

   With the SP3 release of Episys 16, the script `/SYM/MACROS/SYSTEMBACKUP` was rewritten to include the `cfgmgr` command. An environment variable (`ODMDIR`) is also required.

   :::

### Include the environment variable

To add the required environment variable, complete the following steps:

1. Log in as root and run `env`. Note the value for `ODMDIR`.
2. Create the file `/SYM/OP/bin/LOGON` (if it does not exist). Add the following line:

   ```
   export ODMDIR=<value from step 1>
   ```

   If the directory `/SYM/OP/bin` does not exist, create it:

   ```
   mkdir /SYM/OP/bin
   chmod 777 /SYM/OP/bin
   ```

   Then create the file:

   ```
   echo "export ODMDIR=/etc/objrepos" > /SYM/OP/bin/LOGON
   ```

3. Edit `/ops/bin/rootInfo` and set `pathToEnvironment` to `/SYM/OP/bin/LOGON`.
4. Change directories to `/ops/bin` and run `EncryptRootInfo`.

## Limitations

- The `;SCRIPT` directive does not run `ExecuteAsRoot`. This prevents malicious use.
- If a job has been elevated to root permission, all `;SCRIPT` specifications within the job or sub-jobs run as the SYM user, not as root.
- The `ExecuteAsRoot` application can only be driven by RSJ through the SMA Technologies agent.
- The `ExecuteAsRoot` application cannot be renamed.

---
title: Installation
description: "Install RSJ on an Episys server, including new installations, upgrades, and SMA_DATES.JOB setup."
tags:
  - Procedural
  - System Administrator
  - Installation
---

# Installation

## What is it?

RSJ (Remote Symitar Job) is installed on the Episys server's UNIX system and runs through a UNIX agent configured in OpCon. This page covers new installations, upgrades, and the required `SMA_DATES.JOB` configuration that keeps RSJ synchronized with Symitar processing dates.

- Use the new installation procedure when deploying RSJ for the first time on an Episys server.
- Use the upgrade procedure when a new RSJ version is available and an existing installation is already in place.
- Complete the `SMA_DATES.JOB` setup after every installation or upgrade to ensure RSJ correctly interprets Symitar date-based job files.

## Requirements

Before beginning the installation, ensure that the system requirements are met. RSJ must be run through a UNIX agent on the Episys server. For more information, refer to UNIX agent installation in the UNIX agent online help.

When you configure the UNIX agent to run, you must leave the `path_to_su` value set to `no`. For more information, refer to agent configuration parameters in the UNIX agent online help.

**Place the RSJ tar file on the machine with Episys and a UNIX agent.**

1. Copy the tar file from the OpCon distribution directory, `<media>:\Install\LSAM\RSJ`, to the machine for FTP.
2. FTP the RSJ tar file (for example, `rsj_22_00_0100.tar`) to the AIX machine in binary mode. The steps below assume you place it in `/SYM/SYMnnn/LETTERSPECS`, because the `mv` command in each procedure reads it from there. The file name is lower case and the version is underscore-separated; AIX file names are case-sensitive.

   :::note

   [Running RSJ as the SYM user](../reference/sym-user-root.md) gives a shorter route for the same task: transfer the tar file straight to `/ops/bin` and extract it in place, which skips the `mv` step. Either destination works — use the procedure whose later steps match where you put the file.

   :::

## Installation

To install RSJ on a UNIX system, complete either the new installation or upgrade installation procedure in this section depending on which type is required.

### New installation

To install RSJ for the first time, complete the following steps:

1. From the Episys Interface, select **Log off**.
2. From the `$` prompt, issue the following commands:
   - `su`
   - Enter the root password.
3. Create the RSJ directory and move RSJ in place by issuing the following commands:
   - `mkdir /ops`
   - `cd /ops`
   - `mkdir bin`
   - `cd bin`
   - `mv /SYM/SYMnnn/LETTERSPECS/rsj_<version>.tar /ops/bin/rsj_<version>.tar`
4. In `/ops/bin`, untar the file by issuing the following command:
   `tar -xvf rsj_<version>.tar`

### Upgrade installation

To upgrade an existing RSJ installation, complete the following steps:

1. From the Episys Interface, select **Log off**.
2. From the `$` prompt, issue the following commands:
   - `su`
   - Enter the root password.
   - `cd /ops/bin`
   - `mv /SYM/SYMnnn/LETTERSPECS/rsj_<version>.tar /ops/bin/rsj_<version>.tar`
3. In `/ops/bin`, untar the file by issuing the following command:
   `tar -xvf rsj_<version>.tar`

### Set up SMA_DATES.JOB

Each SYM in Episys can be on a different system date. RSJ must know the system date for a given SYM to accurately account for match dates within the Episys job it is running. The `SMA_DATES.JOB` creates an `SMA_DATES` letter file with the current system date of the specified SYM. RSJ reads this letter file to determine which match dates to use. The `SMA_DATES.JOB` and all of its components are installed using the `install_dates` program.

:::warning

When the `install_dates` program runs, it creates the `SMA_DATES.JOB` job file, `SMA_DATES` letter file, and `SMA_DATES.RG` for every SYM. The `SMA_DATES.JOB` is also inserted below the `CLOSEDAY` program in every job file that contains the `CLOSEDAY` program (before doing so, a backup of the job is created with a `_pre.sma` extension). The `SMA_DATES.JOB` is also added into all jobs that contain the `CLOSEDAY` job file.

:::

### Run the install_dates program

To run the `install_dates` program, complete the following steps:

1. Log in to Episys.
2. From the dollar sign prompt, issue the following commands:
   - `su`
   - Enter the root password.
   - `cd /ops/bin`
3. Run the `install_dates` program.

:::tip Example

```
./install_dates sym_number
```

or

```
./install_dates 000
```

:::

4. Run `SMA_DATES.JOB` in Episys for every SYM that OpCon will run jobs in.

:::warning

This file must be updated immediately after any date change or use of the `install_dates` program. Failure to properly install or run `sma_dates` causes RSJ to run incorrectly.

:::

## Security considerations

**Installation requires root.**
The installation procedure requires root access on the Episys server to create `/ops/bin/` and extract the RSJ binaries. The root password must be available before beginning installation.

**RSJ runs as the SYM user.**
After installation, RSJ jobs run under the SYM user account (for example, `SYM000`), not as root. This limits the file system access of RSJ jobs to the directories that the SYM user can reach.

**Root elevation for specific jobs.**
If any Symitar batch jobs require root permissions, use the `ExecuteAsRoot` feature. This requires editing the plain-text `rootInfo` file in `/ops/bin/` and then running `EncryptRootInfo`, which reads it and writes `rootInfo.encrypted` in the same directory. `rootInfo.encrypted` is the file `ExecuteAsRoot` reads at run time, and the credentials in it are stored using Blowfish encryption. For the full procedure, see [Running RSJ as the SYM user](../reference/sym-user-root.md). Do not store the root password in plain text anywhere in the job file or the `SMA_DEFAULTS` file.

**RSJ requires the UNIX agent.**
RSJ checks for the `SMA_CONFIG_FILE` environment variable on startup and exits if it is not set. This prevents RSJ from being run outside of the OpCon UNIX agent, which provides job tracking and access control.

**File permissions on /ops/bin/.**
After installation, verify that the RSJ binaries in `/ops/bin/` are readable and executable by the SYM user. The permissions the installation procedure sets are `775` on `/ops/bin/*`, with `777` on `/ops/bin/args` and `/ops/bin/cancel` because RSJ writes to them while a job runs. See [Running RSJ as the SYM user](../reference/sym-user-root.md) for the commands that set them.

Review these permissions against your own security requirements before accepting them. `/ops/bin` also holds `rootInfo.encrypted` and the `ExecuteAsRoot` binary, so any directory or file mode that is wider than the SYM user needs widens access to root elevation as well.

## FAQs

**Do I need to stop OpCon before upgrading RSJ?**
Place all Symitar machine schedules on hold in OpCon before performing an upgrade to prevent jobs from starting during the upgrade process.

**What happens if SMA_DATES.JOB is not run after installation?**
RSJ will use incorrect processing dates when interpreting date-based directives in job files. This can cause jobs to run on the wrong dates or fail to run at all. Always run `SMA_DATES.JOB` immediately after installation and after any Symitar date change.

**Where is the RSJ tar file located?**
The RSJ tar file is located in the OpCon distribution directory at `<media>:\Install\LSAM\RSJ`. Copy it to the AIX machine via FTP in binary mode before beginning installation.

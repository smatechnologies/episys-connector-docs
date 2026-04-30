---
sidebar_label: 'Release notes'
title: Episys Connector release notes
description: "Version history and change details for the Episys Connector (RSJ), including new features, improvements, and bug fixes."
tags:
  - Reference
  - Automation Engineer
  - Agents
---

# Episys Connector release notes

## 22

### 22.00.0100

2021 December

### What's new

:eight_spoked_asterisk: **CONNUTIL-538**: Added additional debugging into `LookForReportSequenceInReports`.

### Why this matters

The additional debugging output in `LookForReportSequenceInReports` makes it easier to diagnose report retrieval failures without opening a support ticket.

### 22.00.0000

2021 December

### What's new

:eight_spoked_asterisk: **CONNUTIL-538**: Fixed an issue where utilities returned a `SYM is in an unknown state` error message by updating PATH and ENV variables. Added the ability for RSJ, SAJ, and utilities to add environment variables at runtime.

### Why this matters

Updating PATH and ENV variable handling eliminates a class of `SYM is in an unknown state` errors that caused batch jobs to fail unexpectedly. The new ability to add environment variables at runtime gives operations teams more flexibility when configuring jobs without modifying system-level profiles.

## 21

### 21.00.0000

2021 March

:eight_spoked_asterisk: **CONNUTIL-489**: Fixed an issue where `LookForBatchOutputSequence` would fail if the Episys job was run with the `ExecuteAsRoot` utility.

## 18

### 18.00.0000

2018 April

:eight_spoked_asterisk: Added a Java application (`SMASFTPClient`) that satisfies the need for SFTP support.

:eight_spoked_asterisk: Created `optical_transfer_sftp`. This proved not to be viable as it cannot leverage SFTP like `optical_transfer` leverages FTP. An additional module (`ssh_askpass`) has to be installed to handle the password requirement. Since Symitar reformats the drive when an OS upgrade is performed, the new module would be lost.

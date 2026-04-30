---
title: UNIX commands
description: "Quick reference for UNIX commands and tutorials useful for managing RSJ on Episys servers."
tags:
  - Reference
  - System Administrator
  - Agents
---

# UNIX commands

## What is it?

This page provides quick-reference UNIX commands useful for managing and troubleshooting RSJ on Episys servers, along with links to tutorials for learning the UNIX tools commonly used in Episys environments.

- Use these commands when diagnosing system performance issues on the Episys server.
- Use these commands when finding and managing RSJ job files and processes.

## UNIX commands

### diff -r dir dir2

Compare two directories for differences.

### grep -i matchdate *

Find all files that have match date specifications.

### /ops/bin/find_prompts sym# jobfile

Find all prompts in a job.

### id some_user_name

Find the user ID and group ID of a user.

### topas

Displays what is happening on the machine at a system level.

Run this command through a Microsoft telnet session or the freeware program PuTTY (not the Episys terminal).

If the time spent in wait states is more than 5%, or if hard disk usage is more than 40% on any disk, there will be a significant response time delay for all users. This may indicate that the workflow processing needs to be reconsidered.

If a repgen program is using more than 15–20% of the CPU time, there is a good chance that the repgen is written inefficiently. Make the telnet window larger to see more AIX system information.

### ps -dfeal|grep RSJ

Find all running RSJ jobs.

### proctree

Find all running RSJ jobs.

## Tutorials

### VI — UNIX editor

Documentation for learning VI:

[https://engineering.purdue.edu/ECN/Support/KB/Docs/ViTextEditorTutorial/printerfriendly](https://engineering.purdue.edu/ECN/Support/KB/Docs/ViTextEditorTutorial/printerfriendly)

VI editor for Windows that can be installed:

[http://www.vim.org](http://www.vim.org)

### UNIX shell programming

Introduction for creating simple Bourne shell (`sh`) or Korn shell (`ksh`) scripts:

[http://steve-parker.org/sh/sh.shtml](http://steve-parker.org/sh/sh.shtml)
